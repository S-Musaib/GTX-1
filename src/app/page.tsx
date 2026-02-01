"use client";

import { useState, useRef, useCallback } from "react";

// SVG Icons as components (to avoid external dependencies initially)
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

const WandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2"/>
    <path d="M15 16v-2"/>
    <path d="M8 9h2"/>
    <path d="M20 9h2"/>
    <path d="M17.8 11.8 19 13"/>
    <path d="M15 9h0"/>
    <path d="M17.8 6.2 19 5"/>
    <path d="m3 21 9-9"/>
    <path d="M12.2 6.2 11 5"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const EraserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
    <path d="M22 21H7"/>
    <path d="m5 11 9 9"/>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

type Mode = "text-to-image" | "sketch-to-image";
type Tool = "pencil" | "eraser";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("text-to-image");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  // Canvas drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (selectedTool === "eraser") {
      ctx.strokeStyle = "#1a1a1a"; // Canvas background color
    } else {
      ctx.strokeStyle = brushColor;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, brushSize, brushColor, selectedTool]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Simulated image generation (in a real app, this would call an AI API)
  const generateImage = async () => {
    if (!prompt.trim() && mode === "text-to-image") return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate unique ID using crypto API
    const uniqueId = crypto.randomUUID();
    
    // Create a placeholder image (in real implementation, this would be from AI API)
    const newImage: GeneratedImage = {
      id: uniqueId,
      url: generatePlaceholderImage(prompt || "sketch"),
      prompt: prompt || "Generated from sketch",
      timestamp: new Date(),
    };
    
    setGeneratedImages(prev => [newImage, ...prev]);
    setIsGenerating(false);
    setSelectedImage(newImage);
  };

  // Generate a placeholder gradient image with text
  const generatePlaceholderImage = (text: string): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      const hue1 = Math.random() * 360;
      const hue2 = (hue1 + 60 + Math.random() * 60) % 360;
      gradient.addColorStop(0, `hsl(${hue1}, 70%, 40%)`);
      gradient.addColorStop(0.5, `hsl(${(hue1 + hue2) / 2}, 80%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue2}, 70%, 40%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add some random shapes for visual interest
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * 512,
          Math.random() * 512,
          Math.random() * 100 + 50,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.3)`;
        ctx.fill();
      }
      
      // Add text
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Wrap text
      const words = text.split(" ");
      let line = "";
      const lines: string[] = [];
      const maxWidth = 450;
      
      for (const word of words) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== "") {
          lines.push(line.trim());
          line = word + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      
      const lineHeight = 30;
      const startY = 256 - (lines.length - 1) * lineHeight / 2;
      
      lines.forEach((lineText, index) => {
        ctx.fillText(lineText, 256, startY + index * lineHeight);
      });
      
      // Add "AI Generated" watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "14px Arial";
      ctx.fillText("GTX-1 AI Generated (Demo)", 256, 490);
    }
    
    return canvas.toDataURL("image/png");
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const colorPresets = ["#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe", "#fd79a8"];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0d0d0d]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <SparklesIcon />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">GTX-1</h1>
                <p className="text-xs text-gray-500">AI Image Generator</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setMode("text-to-image")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "text-to-image"
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50"
                    : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ImageIcon />
                  Text to Image
                </span>
              </button>
              <button
                onClick={() => setMode("sketch-to-image")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "sketch-to-image"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                    : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <PencilIcon />
                  Sketch to Image
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Input Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input */}
            <div className="glass rounded-2xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {mode === "text-to-image" ? "Describe your image" : "Describe your sketch"}
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    mode === "text-to-image"
                      ? "A majestic dragon flying over a crystal castle at sunset, digital art, highly detailed..."
                      : "Add details to enhance your sketch..."
                  }
                  className="w-full h-32 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {prompt.length} / 500
                </div>
              </div>
            </div>

            {/* Canvas for Sketch Mode */}
            {mode === "sketch-to-image" && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-300">Drawing Canvas</h3>
                  <div className="flex items-center gap-2">
                    {/* Tool Selection */}
                    <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1">
                      <button
                        onClick={() => setSelectedTool("pencil")}
                        className={`p-2 rounded-md transition-all ${
                          selectedTool === "pencil"
                            ? "bg-indigo-500 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                        title="Pencil"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => setSelectedTool("eraser")}
                        className={`p-2 rounded-md transition-all ${
                          selectedTool === "eraser"
                            ? "bg-indigo-500 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                        title="Eraser"
                      >
                        <EraserIcon />
                      </button>
                    </div>
                    
                    {/* Brush Size */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-lg">
                      <span className="text-xs text-gray-400">Size:</span>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-20 accent-indigo-500"
                      />
                      <span className="text-xs text-gray-400 w-6">{brushSize}</span>
                    </div>
                    
                    {/* Clear Button */}
                    <button
                      onClick={clearCanvas}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Clear Canvas"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                
                {/* Color Palette */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-400">Colors:</span>
                  <div className="flex gap-1">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        className={`w-6 h-6 rounded-full transition-all ${
                          brushColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-[#1f1f1f]" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-6 h-6 rounded-full cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
                
                {/* Canvas */}
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[400px] bg-[#1a1a1a] rounded-xl drawing-canvas border border-[#2a2a2a]"
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateImage}
              disabled={isGenerating || (!prompt.trim() && mode === "text-to-image")}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                isGenerating || (!prompt.trim() && mode === "text-to-image")
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 animate-pulse-glow"
              }`}
            >
              {isGenerating ? (
                <>
                  <LoaderIcon />
                  Generating your masterpiece...
                </>
              ) : (
                <>
                  <WandIcon />
                  Generate Image
                </>
              )}
            </button>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-300">Generated Result</h3>
                  <button
                    onClick={() => downloadImage(selectedImage.url, `gtx1-${selectedImage.id}.png`)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-all"
                  >
                    <DownloadIcon />
                    Download
                  </button>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-400">{selectedImage.prompt}</p>
              </div>
            )}
          </div>

          {/* Right Panel - Gallery */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">
                Gallery ({generatedImages.length})
              </h3>
              
              {generatedImages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <ImageIcon />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Your generated images will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {generatedImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`relative aspect-square rounded-lg overflow-hidden group transition-all ${
                        selectedImage?.id === image.id
                          ? "ring-2 ring-indigo-500"
                          : "hover:ring-2 hover:ring-white/50"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs text-white px-2 py-1 bg-black/50 rounded">
                          View
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">✨ Tips</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  Be specific with your descriptions for better results
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Include art style keywords like &quot;digital art&quot;, &quot;oil painting&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  Add lighting details: &quot;golden hour&quot;, &quot;dramatic lighting&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  Use sketch mode to guide the AI with your composition
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            GTX-1 AI Image Generator • Powered by AI • Built with ❤️
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Note: This is a demo interface. Connect an AI API (like OpenAI DALL-E, Stability AI, or Replicate) for actual image generation.
          </p>
        </div>
      </footer>
    </div>
  );
}
