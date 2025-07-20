import crypto from "crypto";
import fs from "fs";
import path from "path";

interface TranslationCache {
  [contentHash: string]: {
    translatedContent: string;
    timestamp: number;
  };
}

const CACHE_FILE = path.join(process.cwd(), ".translation-cache.json");
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export class TranslationService {
  private cache: TranslationCache = {};

  constructor() {
    this.loadCache();
  }

  private loadCache() {
    if (fs.existsSync(CACHE_FILE)) {
      try {
        this.cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      } catch (error) {
        console.warn("Failed to load translation cache:", error);
        this.cache = {};
      }
    }
  }

  private saveCache() {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.error("Failed to save translation cache:", error);
    }
  }

  private generateContentHash(content: string): string {
    return crypto.createHash("md5").update(content).digest("hex");
  }

  private isKorean(text: string): boolean {
    // 200자 이상 한글이 있으면 한글로 판단
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    const koreanMatches = text.match(koreanRegex)?.length || 0;
    return koreanMatches > 200;
  }

  private async callOpenAI(
    content: string,
    targetLanguage: "ko" | "en"
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const prompt =
      targetLanguage === "ko"
        ? `Translate the following markdown content from English to Korean. Preserve all markdown formatting, HTML tags, and frontmatter exactly as they are. Only translate the text content: \n\n${content}`
        : `Translate the following markdown content from Korean to English. Preserve all markdown formatting, HTML tags, and frontmatter exactly as they are. Only translate the text content: \n\n${content}`;

    try {
      console.log(`🌍 Making translation API call (${targetLanguage})...`);

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional translator. Translate the content while preserving all markdown formatting, HTML tags, and code blocks exactly as they are. Only translate the actual text content.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`✅ Translation API call completed successfully`);

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Translation failed:", error);
      throw error;
    }
  }

  async translateContent(content: string): Promise<string> {
    const contentHash = this.generateContentHash(content);

    // Check cache first
    const cached = this.cache[contentHash];
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      console.log("Using cached translation");
      return cached.translatedContent;
    }

    // Determine target language based on content
    const isContentKorean = this.isKorean(content);
    const targetLanguage: "ko" | "en" = isContentKorean ? "en" : "ko";

    console.log(`Translating content to ${targetLanguage}...`);

    try {
      const translatedContent = await this.callOpenAI(content, targetLanguage);

      // Cache the result
      this.cache[contentHash] = {
        translatedContent,
        timestamp: Date.now(),
      };
      this.saveCache();

      return translatedContent;
    } catch (error) {
      console.error("Translation failed, returning original content:", error);
      return content; // Return original content if translation fails
    }
  }

  async translateMarkdownFile(
    filePath: string
  ): Promise<{ original: string; translated: string }> {
    const content = fs.readFileSync(filePath, "utf-8");
    const translatedContent = await this.translateContent(content);

    return {
      original: content,
      translated: translatedContent,
    };
  }
}
