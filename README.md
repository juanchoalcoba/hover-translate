# 🍑 Peach Translator

A lightweight Chrome extension that instantly translates English words to Spanish by simply hovering over them.

![Chrome](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **Hover to translate** - Just move your mouse over any English word
- **Instant results** - Translations appear in a clean tooltip
- **Smart caching** - Words are cached to avoid repeated API calls
- **Lightweight** - No bloat, minimal permissions
- **Free** - Uses MyMemory API, no API key required

## 📸 Demo

![Demo](demo.gif)

## 🚀 Installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/peach-translator.git
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right corner)

4. Click **Load unpacked**

5. Select the `peach-translator` folder

6. Done! The extension is now active on all websites.

## 📁 Project Structure

```
peach-translator/
├── manifest.json        # Configuración de la extensión
├── content.js           # Lógica principal del hover-translate
├── popup.html           # (opcional, pero necesario si querés fijarla)
├── README.md
├── icon16.png
├── icon48.png
└── icon128.png

```

## 🛠️ How It Works

1. Detects the word under your cursor using `caretRangeFromPoint`
2. Sends the word to MyMemory Translation API
3. Displays the translation in a styled tooltip
4. Caches translations to improve performance

## ⚙️ API Used

This extension uses the free [MyMemory API](https://mymemory.translated.net/doc/spec.php) for translations.

- **Limit:** 1000 words/day (anonymous usage)
- **No API key required**

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project however you want.

## 👤 Author

Made with ❤️ by Juan Alcoba

---

⭐ If you found this useful, consider giving it a star!