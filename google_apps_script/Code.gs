/**
 * Google Apps Script - Sugar.fit 5th Anniversary Feedback & Photo Scrapbook Backend
 * 
 * Instructions:
 * 1. Open Google Sheets (or create a new one).
 * 2. Click Extensions -> Apps Script.
 * 3. Replace all code in Code.gs with this script.
 * 4. Replace SPREADSHEET_ID and FOLDER_ID below with your actual IDs.
 * 5. Click Deploy -> New deployment -> Select type: Web app.
 * 6. Set Execute as: "Me"
 * 7. Set Who has access: "Anyone" (CRITICAL for receiving public submissions without login).
 * 8. Deploy & copy the Web App URL into your Next.js frontend!
 */

// ==========================================
// CONFIGURATION (REPLACE THESE 2 VALUES)
// ==========================================
var SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID";
var FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID";

// Default Sheet Name
var SHEET_NAME = "Sheet1";

/**
 * Handle POST request from Next.js Frontend
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No post data received" });
    }

    var data = JSON.parse(e.postData.contents);

    // Open Spreadsheet & Sheet
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Overall Experience",
        "Favourite Part",
        "Food Rating",
        "Entertainment Rating",
        "Highlight",
        "Suggestions / Wishlist",
        "Memory Caption",
        "Image URL",
      ]);
      // Format Header Row
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#F2EEFF");
      headerRange.setFontColor("#5B2EFF");
    }

    // Process Google Drive Photo Upload if base64 image present
    var driveImageUrl = "";
    if (data.userMemoryImage && data.userMemoryImage.indexOf("data:image/") === 0) {
      driveImageUrl = uploadBase64ToDrive(data.userMemoryImage, FOLDER_ID);
    }

    // Extract Feedback Fields
    var timestamp = data.submittedAt || new Date().toISOString();
    var overallExperience = data.overallExperience || "";
    var favoritePart = data.favoritePart || "";
    var foodRating = data.foodRating ? data.foodRating + " / 5" : "";
    var entertainmentRating = data.entertainmentRating ? data.entertainmentRating + " / 10" : "";
    var highlight = data.highlight || "";
    
    // Combine ideas array and custom notes for suggestions
    var suggestionsList = [];
    if (data.nextYearIdeas && data.nextYearIdeas.length > 0) {
      suggestionsList.push("Tags: " + data.nextYearIdeas.join(", "));
    }
    if (data.nextYearNotes) {
      suggestionsList.push("Notes: " + data.nextYearNotes);
    }
    var suggestions = suggestionsList.join(" | ");

    var memoryCaption = data.userMemoryCaption || "";

    // Append Row to Google Sheet
    sheet.appendRow([
      timestamp,
      overallExperience,
      favoritePart,
      foodRating,
      entertainmentRating,
      highlight,
      suggestions,
      memoryCaption,
      driveImageUrl,
    ]);

    return responseJSON({
      status: "success",
      message: "Feedback & memory saved successfully!",
      imageUrl: driveImageUrl,
    });
  } catch (error) {
    return responseJSON({
      status: "error",
      message: error.toString(),
    });
  }
}

/**
 * Handle GET request (CORS test / health check)
 */
function doGet(e) {
  return responseJSON({
    status: "success",
    message: "Sugar.fit Apps Script endpoint active!",
  });
}

/**
 * Upload Base64 Image to Google Drive Folder
 */
function uploadBase64ToDrive(base64DataUrl, folderId) {
  try {
    var folder = DriveApp.getFolderById(folderId);

    // Extract mime type and raw base64 string
    var matches = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return "";
    }

    var mimeType = matches[1];
    var rawBase64 = matches[2];

    // Map MIME type to file extension
    var ext = "jpg";
    if (mimeType.indexOf("png") !== -1) ext = "png";
    if (mimeType.indexOf("webp") !== -1) ext = "webp";
    if (mimeType.indexOf("heic") !== -1) ext = "heic";

    var decodedData = Utilities.base64Decode(rawBase64);
    var filename = "sugarfit_memory_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + "." + ext;
    var blob = Utilities.newBlob(decodedData, mimeType, filename);

    // Create file in Drive Folder
    var file = folder.createFile(blob);
    
    // Set file permission to Anyone with link can view
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return file.getUrl();
  } catch (err) {
    Logger.log("Drive Upload Error: " + err.toString());
    return "";
  }
}

/**
 * Helper to return JSON response
 */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
