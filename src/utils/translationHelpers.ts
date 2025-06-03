export const SUPPORTED_LANGUAGES = {
  KOREAN: "ko",
  ENGLISH: "en",
} as const;

export const LANGUAGE_NAMES = {
  ko: "한국어",
  en: "English",
} as const;

export const detectLanguage = (content: string): "ko" | "en" => {
  // Check if text contains Korean characters
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanRegex.test(content) ? "ko" : "en";
};

export const getOppositeLanguage = (language: "ko" | "en"): "ko" | "en" => {
  return language === "ko" ? "en" : "ko";
};

export const formatTranslationStatus = (
  isTranslated: boolean,
  originalLanguage: "ko" | "en"
) => {
  const targetLanguage = getOppositeLanguage(originalLanguage);
  return {
    status: isTranslated ? "translated" : "original",
    from: LANGUAGE_NAMES[originalLanguage],
    to: LANGUAGE_NAMES[targetLanguage],
  };
};
