import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";
import { PenTool, Sparkles, Send, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function CreateBlog() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiImage, setAiImage] = useState(null); // Base64 preview
  const [aiLoading, setAiLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // File for upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Quick example prompts
  const examplePrompts = [
    "beautiful mountain landscape at sunset, vibrant colors",
    "modern minimalist tech workspace",
    "delicious food photography, well-lit",
    "abstract business growth concept",
    "peaceful nature scene with lake and forest"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please login to create a blog!");
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📝 Creating blog...");
      console.log("Image type:", image ? "File upload" : "No image");
      console.log("AI Image:", aiImage ? "AI generated" : "No AI image");

      // ✅ Check if AI-generated image hai (Base64) or uploaded file
      if (aiImage && aiImage.startsWith('data:image')) {
        // AI-generated image hai - directly Base64 URL bhejo
        console.log("🤖 Using AI-generated image (Base64)");
        
        const blogData = {
          title,
          content,
          aiImageUrl: aiImage, // ✅ Base64 image directly bhejo
        };

        // Use JSON format
        const res = await fetch("https://blognow-ckae.onrender.com/api/blogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(blogData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create blog");
        }

        const data = await res.json();
        console.log("✅ Blog created:", data);
        
        toast.success("✅ Blog created successfully!");
        navigate("/myblogs");
        
      } else if (image) {
        // Manual file upload hai - FormData use karo
        console.log("📁 Using uploaded file:", image.name);
        
        const res = await api.createBlog({ title, content, image }, token);
        
        if (res.error) {
          toast.error(res.error);
          return;
        }

        toast.success("✅ Blog created successfully!");
        navigate("/myblogs");
      } else {
        // No image
        const res = await api.createBlog({ title, content }, token);
        
        if (res.error) {
          toast.error(res.error);
          return;
        }

        toast.success("✅ Blog created successfully!");
        navigate("/myblogs");
      }
      
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ AI Image Generation Handler
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("⚠️ Please enter a description for AI image!");
      return;
    }

    setAiLoading(true);
    setAiImage(null);
    setImage(null);

    try {
      console.log("🎨 Generating AI image for:", aiPrompt);
      const res = await api.generateImage(aiPrompt);

      console.log("📦 Full API Response:", res);

      // Check for errors
      if (res.error || res.message?.includes('error') || !res.image) {
        const errorMsg = res.error || res.message || 'Failed to generate image';
        console.error("❌ API returned error:", errorMsg);
        toast.error(errorMsg);
        return;
      }

      // ✅ Get image data from response
      const base64Image = res.image || res.data?.image;
      
      // Check if we got valid image data
      if (!base64Image || !base64Image.startsWith('data:image')) {
        console.error("❌ Invalid image data received");
        toast.error("Invalid image data received");
        return;
      }

      console.log("✅ Image data received, length:", base64Image.length);

      // Set preview
      setAiImage(base64Image);
      toast.success("🎉 AI image generated successfully!");
      console.log("✅ AI image ready for blog");
      
    } catch (error) {
      console.error("❌ Generation Error:", error);
      toast.error("Image generation failed: " + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle manual file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAiImage(reader.result);
        toast.success(`📎 File selected: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use example prompt
  const useExamplePrompt = (prompt) => {
    setAiPrompt(prompt);
    toast.info(`💡 Using example: ${prompt.substring(0, 30)}...`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <PenTool className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-2">
              Create Your Story
            </h1>
            <p className="text-xl text-purple-200 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Let your creativity shine
              <Sparkles className="w-5 h-5" />
            </p>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:bg-white/15 transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Input */}
              <div className="relative group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=" "
                  className="w-full h-16 px-6 pt-6 pb-2 text-lg text-white bg-white/5 border-2 border-purple-300/30 rounded-2xl focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 peer placeholder-transparent"
                />
                <label className="absolute left-6 top-2 text-sm text-purple-300 transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-purple-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400">
                  Blog Title
                </label>
              </div>

              {/* Content Textarea */}
              <div className="relative group">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder=" "
                  rows={8}
                  className="w-full px-6 pt-6 pb-2 text-lg text-white bg-white/5 border-2 border-purple-300/30 rounded-2xl focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 peer placeholder-transparent resize-none"
                />
                <label className="absolute left-6 top-2 text-sm text-purple-300 transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-purple-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400">
                  Your Story Content
                </label>
              </div>

              {/* AI IMAGE GENERATION */}
              <div className="backdrop-blur-xl bg-white/5 border border-purple-300/30 rounded-2xl p-6">
                <label className="flex items-center gap-2 text-purple-300 mb-4 text-lg font-semibold">
                  <Sparkles className="w-6 h-6 text-pink-400" />
                  Generate Image with AI
                </label>

                {/* Example Prompts */}
                <div className="mb-4">
                  <p className="text-xs text-purple-300 mb-2">💡 Quick examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => useExamplePrompt(example)}
                        disabled={aiLoading}
                        className="text-xs bg-white/10 hover:bg-white/20 text-purple-200 px-3 py-1 rounded-full transition-all duration-300 disabled:opacity-50"
                      >
                        {example.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border-2 border-purple-400/40 text-white placeholder-purple-300/50 focus:border-pink-400 focus:outline-none transition-all duration-300"
                    value={aiPrompt}
                    disabled={aiLoading}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe your image... (e.g., sunset over mountains)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAIGenerate();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="bg-gradient-to-r from-pink-500 to-cyan-500 px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    onClick={handleAIGenerate}
                    disabled={aiLoading || !aiPrompt.trim()}
                  >
                    {aiLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Image Preview */}
                {aiImage && (
                  <div className="mt-4 space-y-3">
                    <div className="relative overflow-hidden rounded-xl border-2 border-pink-400/50 shadow-2xl bg-black/20">
                      <img
                        src={aiImage}
                        alt="AI Generated Preview"
                        className="w-full max-h-80 object-contain"
                        onError={(e) => {
                          console.error("❌ Preview failed to load");
                          toast.error("Failed to display preview");
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" fill="white">Error</text></svg>';
                        }}
                        onLoad={() => {
                          console.log("✅ Preview loaded successfully");
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-lg border border-green-400/30">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Image ready for your blog!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Upload */}
              <div className="relative group">
                <label className="flex items-center gap-2 text-purple-300 mb-3 text-lg font-semibold">
                  <ImageIcon className="w-6 h-6 text-cyan-400" />
                  Or Upload Your Own Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-purple-200 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:cursor-pointer file:transition-all file:duration-300"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 h-14 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="flex-[2] h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Publish Story
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}