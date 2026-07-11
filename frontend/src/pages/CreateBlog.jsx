import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";
import { PenTool, Sparkles, Send, ArrowLeft, Image as ImageIcon, Check } from "lucide-react";

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
        console.log("🤖 Using AI-generated image (Base64)");

        const blogData = {
          title,
          content,
          aiImageUrl: aiImage,
        };

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

        toast.success("Blog created successfully!");
        navigate("/myblogs");

      } else if (image) {
        console.log("📁 Using uploaded file:", image.name);

        const res = await api.createBlog({ title, content, image }, token);

        if (res.error) {
          toast.error(res.error);
          return;
        }

        toast.success("Blog created successfully!");
        navigate("/myblogs");
      } else {
        const res = await api.createBlog({ title, content }, token);

        if (res.error) {
          toast.error(res.error);
          return;
        }

        toast.success("Blog created successfully!");
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
      toast.error("Please enter a description for the AI image!");
      return;
    }

    setAiLoading(true);
    setAiImage(null);
    setImage(null);

    try {
      console.log("🎨 Generating AI image for:", aiPrompt);
      const res = await api.generateImage(aiPrompt);

      console.log("📦 Full API Response:", res);

      if (res.error || res.message?.includes('error') || !res.image) {
        const errorMsg = res.error || res.message || 'Failed to generate image';
        console.error("❌ API returned error:", errorMsg);
        toast.error(errorMsg);
        return;
      }

      const base64Image = res.image || res.data?.image;

      if (!base64Image || !base64Image.startsWith('data:image')) {
        console.error("❌ Invalid image data received");
        toast.error("Invalid image data received");
        return;
      }

      console.log("✅ Image data received, length:", base64Image.length);

      setAiImage(base64Image);
      toast.success("AI image generated successfully!");
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setAiImage(reader.result);
        toast.success(`File selected: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use example prompt
  const useExamplePrompt = (prompt) => {
    setAiPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#111827] flex items-center justify-center mb-4">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827] mb-1">
            Create a new blog
          </h1>
          <p className="text-sm text-[#6B7280]">
            Write your story and add a cover image.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your blog a title"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell your story…"
                rows={8}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors resize-none"
              />
            </div>

            {/* AI Image Generation */}
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-[#374151] mb-3">
                <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                Generate a cover image with AI
              </label>

              {/* Example Prompts */}
              <div className="mb-3">
                <p className="text-xs text-[#9CA3AF] mb-2">Quick examples</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => useExamplePrompt(example)}
                      disabled={aiLoading}
                      className="text-xs bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full border border-[#E5E7EB] transition-colors disabled:opacity-50"
                    >
                      {example.substring(0, 28)}…
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors"
                  value={aiPrompt}
                  disabled={aiLoading}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe the image you want…"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAIGenerate();
                    }
                  }}
                />
                <button
                  type="button"
                  className="bg-[#111827] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#1F2937] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                >
                  {aiLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>

              {/* Image Preview */}
              {aiImage && (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                    <img
                      src={aiImage}
                      alt="Preview"
                      className="w-full max-h-72 object-contain"
                      onError={(e) => {
                        console.error("❌ Preview failed to load");
                        toast.error("Failed to display preview");
                      }}
                      onLoad={() => {
                        console.log("✅ Preview loaded successfully");
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#059669] bg-[#ECFDF5] px-3.5 py-2 rounded-lg border border-[#A7F3D0]">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Image ready for your blog</span>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#374151] mb-2">
                <ImageIcon className="w-4 h-4 text-[#6B7280]" />
                Or upload your own image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-sm text-[#6B7280] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-[#E5E7EB] file:text-sm file:font-medium file:bg-white file:text-[#374151] hover:file:bg-[#F9FAFB] file:cursor-pointer file:transition-colors"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 text-sm font-medium text-[#374151] border border-[#E5E7EB] py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex-[2] bg-[#111827] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F2937] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Publishing…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish story
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}