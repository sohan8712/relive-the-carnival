/**
 * Google Apps Script Backend API - Sugar.fit 5th Anniversary Memory Wall & Feedback DB
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Apps Script editor.
 * 2. Replace SPREADSHEET_ID and FOLDER_ID with your actual IDs below.
 * 3. Deploy -> New deployment -> Web app -> Execute as: Me -> Who has access: Anyone.
 */

var SPREADSHEET_ID = "1FgEnyhrDrJyZK9MeuKx7ZJfcKJJn1l4LtaS95hqodHU";
var FOLDER_ID = "1XcYUuu5XQMliT0VVgZZdgV7-gRChb1_V";
var SHEET_NAME = "Sheet1";

/**
 * Handles HTTP GET requests: Serves Live Community Gallery JSON
 * Endpoint: GET ?action=gallery
 * Optional: GET ?action=gallery&preview=true
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "gallery";

    if (action === "gallery") {
      var isPreview = (e && e.parameter && e.parameter.preview === "true");
      var galleryItems = getGalleryFromSheet(isPreview);
      return responseJSON({
        status: "success",
        count: galleryItems.length,
        items: galleryItems,
      });
    }

    return responseJSON({
      status: "success",
      message: "Sugar.fit Living Film Reel API is operational!",
      time: new Date().toISOString(),
    });
  } catch (error) {
    return responseJSON({
      status: "error",
      message: error.toString(),
    });
  }
}

/**
 * Handles HTTP POST requests: Saves feedback row & uploads memory photo to Google Drive
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No payload contents received" });
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Ensure headers exist
    ensureHeaders(sheet);

    // Upload memory image to Google Drive if present
    var driveImageUrl = "";
    var directWebImageUrl = "";
    if (data.userMemoryImage && data.userMemoryImage.indexOf("data:image/") === 0) {
      var uploadResult = uploadBase64ToDrive(data.userMemoryImage, FOLDER_ID);
      driveImageUrl = uploadResult.driveUrl;
      directWebImageUrl = uploadResult.directWebUrl;
    }

    var timestamp = data.submittedAt || new Date().toISOString();
    var overallExperience = data.overallExperience || "";
    var favoritePart = data.favoritePart || "";
    var foodRating = data.foodRating ? data.foodRating + " / 5" : "";
    var entertainmentRating = data.entertainmentRating ? data.entertainmentRating + " / 10" : "";
    var highlight = data.highlight || "";
    
    var wishlistParts = [];
    if (data.nextYearIdeas && data.nextYearIdeas.length > 0) {
      wishlistParts.push("Tags: " + data.nextYearIdeas.join(", "));
    }
    if (data.nextYearNotes) {
      wishlistParts.push("Notes: " + data.nextYearNotes);
    }
    var wishlist = wishlistParts.join(" | ");
    var memoryCaption = data.userMemoryCaption || "";
    var isApproved = "TRUE"; // Approved by default for live community wall
    var createdAt = new Date().toISOString();

    // Append new row to Google Sheet
    sheet.appendRow([
      timestamp,
      overallExperience,
      favoritePart,
      foodRating,
      entertainmentRating,
      highlight,
      wishlist,
      memoryCaption,
      directWebImageUrl || driveImageUrl,
      isApproved,
      createdAt,
    ]);

    var lastRow = sheet.getLastRow();

    return responseJSON({
      status: "success",
      message: "Feedback & memory saved directly to Sugar.fit database!",
      row: lastRow,
      imageUrl: directWebImageUrl || driveImageUrl,
    });
  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return responseJSON({
      status: "error",
      message: error.toString(),
    });
  }
}

/**
 * Fetches gallery photo memories from Google Sheet
 */
function getGalleryFromSheet(isPreview) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
  var items = [];

  for (var i = data.length - 1; i >= 0; i--) { // Reverse order (newest first)
    var row = data[i];
    var timestamp = row[0];
    var caption = row[7];
    var imageUrl = row[8];
    var approved = row[9];

    // Filter by approval status if not preview mode
    if (!imageUrl) continue;
    if (!isPreview && approved !== "TRUE" && approved !== true && approved !== "true" && approved !== "") {
      continue;
    }

    items.push({
      id: "sheet-mem-" + (i + 2),
      image: imageUrl,
      title: caption ? "Community Memory" : "Sugar.fit Carnival Memory",
      caption: caption || "Captured at Sugar.fit 5th Anniversary Carnival.",
      author: "Sugar.fit Member",
      timestamp: timestamp,
      frameNum: "35MM • " + (items.length + 1) + "A",
    });
  }

  return items;
}

/**
 * Uploads Base64 image to Google Drive folder and generates shareable URLs
 */
function uploadBase64ToDrive(base64DataUrl, folderId) {
  try {
    var folder = DriveApp.getFolderById(folderId);
    var matches = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return { driveUrl: "", directWebUrl: "" };

    var mimeType = matches[1];
    var rawBase64 = matches[2];

    var ext = "jpg";
    if (mimeType.indexOf("png") !== -1) ext = "png";
    if (mimeType.indexOf("webp") !== -1) ext = "webp";
    if (mimeType.indexOf("heic") !== -1) ext = "heic";

    var decodedData = Utilities.base64Decode(rawBase64);
    var filename = "sugarfit_memory_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + "." + ext;
    var blob = Utilities.newBlob(decodedData, mimeType, filename);

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    var driveUrl = file.getUrl();
    // Direct web view URL for fast embedding in <img> tags
    var directWebUrl = "https://lh3.googleusercontent.com/d/" + fileId;

    return {
      driveUrl: driveUrl,
      directWebUrl: directWebUrl
    };
  } catch (err) {
    Logger.log("Drive Upload Error: " + err.toString());
    return { driveUrl: "", directWebUrl: "" };
  }
}

/**
 * Helper to ensure Google Sheet headers are initialized
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Overall Experience",
      "Favourite Part",
      "Food Rating",
      "Entertainment Rating",
      "Highlight",
      "Wishlist",
      "Memory Caption",
      "Image URL",
      "Approved",
      "Created At",
    ]);
    var headerRange = sheet.getRange(1, 1, 1, 11);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#F2EEFF");
    headerRange.setFontColor("#5B2EFF");
  }
}

/**
 * Returns JSON response with CORS headers
 */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
