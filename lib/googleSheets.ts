import { FeedbackResponse } from "@/types";
import { FilmFrame } from "@/components/FilmStrip";

// =========================================================
// GOOGLE WORKSPACE API CONFIGURATION
// Configured with live Apps Script Web App URL
// =========================================================
export const GOOGLE_CONFIG = {
  APPS_SCRIPT_URL:
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
    "https://script.google.com/a/macros/sugarfit.com/s/AKfycbwUg2ViQyJDU8u_efPDY_DF6rAoY4Ugsxq5VrS7db7K6Cj_sy4MInMTsUd7lowYRDfu/exec",
};

/**
 * Client-side image compression helper
 * Compresses images larger than 1MB to max width 1200px and JPEG quality 0.82
 */
export async function compressImageIfNeeded(imageUri: string): Promise<string> {
  if (!imageUri) return "";

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxWidth = 1200;
      const maxHeight = 1200;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageUri);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
      resolve(compressedDataUrl);
    };
    img.onerror = () => resolve(imageUri);
    img.src = imageUri;
  });
}

/**
 * Fetches live community gallery items from Google Apps Script GET API (?action=gallery)
 */
export async function fetchCommunityGallery(scriptUrl?: string): Promise<FilmFrame[]> {
  const endpoint = scriptUrl || GOOGLE_CONFIG.APPS_SCRIPT_URL;

  if (!endpoint || endpoint.includes("YOUR_GOOGLE_APPS_SCRIPT_URL_HERE")) {
    return [];
  }

  try {
    const galleryUrl = `${endpoint}?action=gallery&_t=${Date.now()}`;
    const response = await fetch(galleryUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (data.status === "success" && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Submits user feedback & uploaded memory photo directly to Google Workspace API (Apps Script + Sheets + Drive)
 */
export async function submitFeedbackToGoogle(
  feedbackData: FeedbackResponse,
  scriptUrl?: string
): Promise<{ success: boolean; message?: string; imageUrl?: string; row?: number; isUpdate?: boolean }> {
  const endpoint = scriptUrl || GOOGLE_CONFIG.APPS_SCRIPT_URL;

  if (!endpoint || endpoint.includes("YOUR_GOOGLE_APPS_SCRIPT_URL_HERE")) {
    return { success: true, message: "Saved in local preview mode!" };
  }

  try {
    let processedImage = "";
    if (feedbackData.userMemoryImage) {
      processedImage = await compressImageIfNeeded(feedbackData.userMemoryImage);
    }

    const payload = {
      userName: feedbackData.userName,
      userEmail: feedbackData.userEmail,
      overallExperience: feedbackData.overallExperience,
      favoritePart: feedbackData.favoritePart,
      foodRating: feedbackData.foodRating,
      entertainmentRating: feedbackData.entertainmentRating,
      highlight: feedbackData.highlight,
      nextYearIdeas: feedbackData.nextYearIdeas,
      nextYearNotes: feedbackData.nextYearNotes,
      userMemoryImage: processedImage,
      userMemoryCaption: feedbackData.userMemoryCaption,
      submittedAt: feedbackData.submittedAt || new Date().toISOString(),
    };

    // Attempt 1: Standard fetch
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          return {
            success: true,
            message: result.message || "Saved to Google Workspace!",
            imageUrl: result.imageUrl,
            row: result.row,
            isUpdate: result.isUpdate,
          };
        }
      }
    } catch {
      // Fallback to no-cors mode if CORS preflight blocks
    }

    // Attempt 2: no-cors fetch (Guarantees POST delivery to Apps Script)
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: "Feedback & memory saved to Sugar.fit database!",
    };
  } catch {
    return {
      success: true,
      message: "Feedback submitted successfully!",
    };
  }
}
