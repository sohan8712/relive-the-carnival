/**
 * Google Apps Script Backend API - Sugar.fit 5th Anniversary Memory Wall & Feedback DB
 * 
 * Includes User Identity, Duplicate Email Detection & Row Updating Logic
 */

var SPREADSHEET_ID = "1FgEnyhrDrJyZK9MeuKx7ZJfcKJJn1l4LtaS95hqodHU";
var FOLDER_ID = "1XcYUuu5XQMliT0VVgZZdqV7-gRChb1_V";
var SHEET_NAME = "Sheet1";

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

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No payload contents received" });
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    ensureHeaders(sheet);

    // Process Google Drive image upload
    var driveImageUrl = "";
    var directWebImageUrl = "";
    if (data.userMemoryImage && data.userMemoryImage.indexOf("data:image/") === 0) {
      var uploadResult = uploadBase64ToDrive(data.userMemoryImage, FOLDER_ID);
      driveImageUrl = uploadResult.driveUrl;
      directWebImageUrl = uploadResult.directWebUrl;
    }

    var timestamp = data.submittedAt || new Date().toISOString();
    var userName = data.userName || "Anonymous";
    var userEmail = (data.userEmail || "").trim().toLowerCase();
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
    var finalImageUrl = directWebImageUrl || driveImageUrl;
    var isApproved = "TRUE";
    var createdAt = new Date().toISOString();

    var targetRowIndex = -1;

    // Duplicate detection: Check if userEmail already exists in Column 3 (Email)
    if (userEmail && sheet.getLastRow() > 1) {
      var emailValues = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
      for (var r = 0; r < emailValues.length; r++) {
        if (emailValues[r][0].toString().trim().toLowerCase() === userEmail) {
          targetRowIndex = r + 2; // Row number in sheet (1-indexed, starting after header)
          break;
        }
      }
    }

    var rowValues = [
      timestamp,
      userName,
      userEmail,
      overallExperience,
      favoritePart,
      foodRating,
      entertainmentRating,
      highlight,
      wishlist,
      memoryCaption,
      finalImageUrl,
      isApproved,
      createdAt,
    ];

    if (targetRowIndex > 1) {
      // Update existing row if duplicate email detected
      sheet.getRange(targetRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      return responseJSON({
        status: "success",
        message: "Updated existing feedback for " + userEmail,
        row: targetRowIndex,
        imageUrl: finalImageUrl,
        isUpdate: true
      });
    } else {
      // Append new row
      sheet.appendRow(rowValues);
      var lastRow = sheet.getLastRow();
      return responseJSON({
        status: "success",
        message: "Feedback & memory saved to Sugar.fit database!",
        row: lastRow,
        imageUrl: finalImageUrl,
        isUpdate: false
      });
    }
  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return responseJSON({
      status: "error",
      message: error.toString(),
    });
  }
}

function getGalleryFromSheet(isPreview) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
  var items = [];

  for (var i = data.length - 1; i >= 0; i--) {
    var row = data[i];
    var timestamp = row[0];
    var name = row[1];
    var caption = row[9];
    var imageUrl = row[10];
    var approved = row[11];

    if (!imageUrl) continue;
    if (!isPreview && approved !== "TRUE" && approved !== true && approved !== "true" && approved !== "") {
      continue;
    }

    items.push({
      id: "sheet-mem-" + (i + 2),
      image: imageUrl,
      title: caption ? "Community Memory" : "Sugar.fit Carnival Memory",
      caption: caption || "Captured at Sugar.fit 5th Anniversary Carnival.",
      author: name || "Sugar.fit Member",
      timestamp: timestamp,
      frameNum: "35MM • " + (items.length + 1) + "A",
    });
  }

  return items;
}

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

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
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
    var headerRange = sheet.getRange(1, 1, 1, 13);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#F2EEFF");
    headerRange.setFontColor("#5B2EFF");
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
