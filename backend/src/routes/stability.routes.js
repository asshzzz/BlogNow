import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();
const router = express.Router();

// ✅ ES Module ke liye __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory at:", uploadsDir);
}

/**
 * POST /api/ai/generate-image
 * Generate image using Stability AI (SDXL)
 * Works with .env STABILITY_API_KEY
 */
router.post("/generate-image", async (req, res) => {
  try {
    const { prompt, width = 1024, height = 1024, steps = 30 } = req.body;
    
    console.log("🎨 Generating image for prompt:", prompt);

    // ✅ Validate prompt
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Prompt is required" 
      });
    }

    // ✅ Check for Stability AI API key first
    const stabilityKey = process.env.STABILITY_API_KEY;
    
    if (!stabilityKey) {
      console.error("❌ STABILITY_API_KEY not found in .env");
      return res.status(500).json({ 
        success: false,
        error: "Stability API key not configured. Please add STABILITY_API_KEY to .env file" 
      });
    }

    // ✅ Call Stability AI API
    console.log("📡 Calling Stability AI API...");
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${stabilityKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: parseInt(height),
          width: parseInt(width),
          steps: parseInt(steps),
          samples: 1,
        }),
      }
    );

    console.log("📡 Stability AI Response Status:", response.status);

    // ✅ Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Stability AI Error:", errorText);
      
      let errorMessage = "Failed to generate image";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText.substring(0, 200); // Limit error length
      }

      return res.status(response.status).json({ 
        success: false,
        error: errorMessage,
        details: errorText 
      });
    }

    // ✅ Parse JSON response (Stability returns JSON with base64)
    const data = await response.json();
    
    if (!data.artifacts || !data.artifacts[0] || !data.artifacts[0].base64) {
      console.error("❌ Invalid response format from Stability AI");
      return res.status(500).json({ 
        success: false,
        error: "Invalid response format from API" 
      });
    }

    const base64Image = data.artifacts[0].base64;
    const buffer = Buffer.from(base64Image, 'base64');
    
    console.log("📦 Received image size:", buffer.length, "bytes");

    if (buffer.length === 0) {
      console.error("❌ Empty buffer received");
      return res.status(500).json({ 
        success: false,
        error: "Received empty image data" 
      });
    }

    // ✅ Verify PNG format
    const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    console.log("🔍 Is valid PNG:", isPNG);

    // ✅ Generate unique filename
    const fileName = `ai-image-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);
    
    // ✅ Write file with error handling
    try {
      fs.writeFileSync(filePath, buffer);
      console.log("✅ Image saved successfully at:", filePath);
      
      // ✅ Verify file was written correctly
      const stats = fs.statSync(filePath);
      console.log("📁 File size on disk:", stats.size, "bytes");
      
      if (stats.size === 0) {
        throw new Error("Generated file is empty");
      }

      // ✅ Verify read back
      const readBuffer = fs.readFileSync(filePath);
      console.log("✅ File verification:", readBuffer.length === buffer.length ? "PASS ✓" : "FAIL ✗");
      
    } catch (writeErr) {
      console.error("❌ Error writing file:", writeErr);
      return res.status(500).json({ 
        success: false,
        error: "Failed to save image file",
        details: writeErr.message 
      });
    }

    // ✅ Convert buffer to Base64 for direct use
    const base64DataUrl = `data:image/png;base64,${base64Image}`;
    
    console.log("✅ Image generated successfully");
    console.log("📊 Base64 length:", base64DataUrl.length);
    
    // ✅ Send response
    res.json({ 
      success: true,
      message: "Image generated successfully",
      image: base64DataUrl,              // Base64 data URL for direct preview
      imageUrl: `/uploads/${fileName}`,  // Server path for permanent storage
      fileName: fileName,
      prompt: prompt,
      dimensions: {
        width: parseInt(width),
        height: parseInt(height)
      }
    });

  } catch (err) {
    console.error("⚠️ Error generating image:", err);
    res.status(500).json({ 
      success: false,
      error: "Image generation failed",
      details: err.message 
    });
  }
});

/**
 * GET /api/ai/images
 * Get list of all generated images
 */
router.get("/images", (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        count: 0,
        images: []
      });
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => file.startsWith('ai-image-') && file.endsWith('.png'))
      .map(file => {
        const stats = fs.statSync(path.join(uploadsDir, file));
        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Latest first

    res.json({
      success: true,
      count: images.length,
      images: images
    });
  } catch (error) {
    console.error("Error listing images:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/ai/images/:filename
 * Delete a specific generated image
 */
router.delete("/images/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    
    // Security: only allow deleting ai-image-* files
    if (!filename.startsWith('ai-image-') || !filename.endsWith('.png')) {
      return res.status(400).json({
        success: false,
        error: "Invalid filename"
      });
    }

    const filepath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        error: "Image not found"
      });
    }

    fs.unlinkSync(filepath);
    console.log("🗑️ Deleted image:", filename);

    res.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/ai/generate-batch
 * Generate multiple images from array of prompts
 */
router.post("/generate-batch", async (req, res) => {
  try {
    const { prompts } = req.body;

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Prompts array is required"
      });
    }

    if (prompts.length > 5) {
      return res.status(400).json({
        success: false,
        error: "Maximum 5 prompts allowed per batch"
      });
    }

    const stabilityKey = process.env.STABILITY_API_KEY;
    if (!stabilityKey) {
      return res.status(500).json({
        success: false,
        error: "Stability API key not configured"
      });
    }

    console.log(`🎨 Generating ${prompts.length} images in batch...`);

    const results = [];

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      console.log(`📸 Generating image ${i + 1}/${prompts.length}: ${prompt}`);

      try {
        const response = await fetch(
          "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${stabilityKey}`,
            },
            body: JSON.stringify({
              text_prompts: [{ text: prompt, weight: 1 }],
              cfg_scale: 7,
              height: 1024,
              width: 1024,
              steps: 30,
              samples: 1,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const base64Image = data.artifacts[0].base64;
          const buffer = Buffer.from(base64Image, 'base64');
          
          const fileName = `ai-image-${Date.now()}-${i}.png`;
          const filePath = path.join(uploadsDir, fileName);
          fs.writeFileSync(filePath, buffer);

          results.push({
            success: true,
            prompt: prompt,
            filename: fileName,
            imageUrl: `/uploads/${fileName}`
          });

          console.log(`✅ Image ${i + 1} generated successfully`);
        } else {
          const errorText = await response.text();
          results.push({
            success: false,
            prompt: prompt,
            error: errorText
          });
          console.log(`❌ Image ${i + 1} failed`);
        }

        // Delay to avoid rate limiting (1 second between requests)
        if (i < prompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        results.push({
          success: false,
          prompt: prompt,
          error: error.message
        });
        console.log(`❌ Image ${i + 1} error:`, error.message);
      }
    }

    const successful = results.filter(r => r.success).length;
    console.log(`✅ Batch complete: ${successful}/${prompts.length} successful`);

    res.json({
      success: true,
      total: prompts.length,
      successful: successful,
      failed: prompts.length - successful,
      results: results
    });

  } catch (error) {
    console.error("Error in batch generation:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/ai/health
 * Health check for AI service
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Image Generation",
    stabilityApiConfigured: !!process.env.STABILITY_API_KEY,
    uploadsDirectory: uploadsDir,
    uploadsExists: fs.existsSync(uploadsDir)
  });
});

export default router;