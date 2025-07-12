# Seho Lee's Blog

A Gatsby-based blog with automatic translation functionality.

## Features

- **Automatic Translation**: Blog posts are automatically translated between Korean and English using OpenAI's GPT
- **Language Toggle**: Users can switch between original and translated content with a toggle in the menubar
- **Smart Caching**: Translations are cached to avoid unnecessary API calls and costs
- **Content Detection**: Automatically detects the original language and translates to the opposite language
- **Rate Limiting**: Built-in rate limiting and retry logic to handle API limits gracefully

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   # Create a .env file with your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here

   # Optional: Enable translation in development mode
   ENABLE_TRANSLATION=true
   ```

3. Development (translations disabled by default):

   ```bash
   npm run dev
   ```

4. Build with translations:
   ```bash
   npm run build
   ```

## Environment Variables

- `OPENAI_API_KEY`: Required for translation functionality
- `ENABLE_TRANSLATION`: Set to `true` to enable translations in development mode (default: disabled in dev)

## Translation Behavior

- **Production builds**: Translations are enabled by default if `OPENAI_API_KEY` is set
- **Development mode**: Translations are disabled by default to avoid API costs and rate limits
- **Rate limiting**: 1 second minimum between API requests with exponential backoff for 429 errors
- **Retry logic**: Automatic retries with exponential backoff for network errors and rate limits
- **Graceful failures**: If translation fails, the original content is used

During the build process, the translation service will:

- Detect the language of each markdown file
- Translate Korean content to English and English content to Korean
- Cache translations for future builds
- Create translated versions of all content
- Handle rate limits and network errors automatically

## Usage

- Use the language toggle in the menubar to switch between original and translated content
- The toggle shows "원본" (Original) and "번역" (Translated)
- Language preference is saved in localStorage

## Translation Cache

The translation cache (`.translation-cache.json`) stores translated content to avoid redundant API calls. This file is automatically managed and should not be committed to version control.
