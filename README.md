# GTX-1 🎨

**Your Personal AI Image Generator** - A modern web application for creating stunning images from text prompts or sketches.

![GTX-1 AI Image Generator](https://img.shields.io/badge/AI-Image%20Generator-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC)

## ✨ Features

### 🖼️ Text to Image
- Enter detailed text prompts to generate unique images
- AI interprets your descriptions and creates visual art
- Support for various art styles and themes

### ✏️ Sketch to Image
- Draw your ideas on an interactive canvas
- Transform rough sketches into polished AI artwork
- Combine sketches with text prompts for better results

### 🎨 Drawing Tools
- Pencil tool with adjustable brush sizes
- Eraser for corrections
- Color palette with presets and custom color picker
- Clear canvas functionality

### 📁 Image Gallery
- View all your generated images in one place
- Click to preview any generated image
- Download images in PNG format

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/S-Musaib/GTX-1.git
cd GTX-1
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Adding AI Backend

This is a frontend demo. To enable actual AI image generation, you'll need to integrate an AI API:

**Option 1: OpenAI DALL-E**
```env
OPENAI_API_KEY=your_api_key
```

**Option 2: Stability AI**
```env
STABILITY_API_KEY=your_api_key
```

**Option 3: Replicate**
```env
REPLICATE_API_TOKEN=your_api_token
```

## 📁 Project Structure

```
GTX-1/
├── src/
│   └── app/
│       ├── globals.css    # Global styles and theme
│       ├── layout.tsx     # Root layout component
│       └── page.tsx       # Main application page
├── public/                # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🎯 Roadmap

- [ ] Add AI API integration (DALL-E, Stability AI)
- [ ] Image editing/inpainting features
- [ ] Image-to-image transformation
- [ ] Save prompts as templates
- [ ] User authentication
- [ ] Cloud storage for generated images
- [ ] Multiple model selection
- [ ] Advanced style controls

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Icons**: Custom SVG components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Freepik Pikaso](https://www.freepik.com/pikaso)
- Built with modern web technologies
- Designed for ease of use and extensibility

---

**GTX-1** - Creating art, one prompt at a time. 🎨
