const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { uploadToGoFile } = require('./uploadToGoFile');

/**
 * Upload a video file to Catbox. Returns the URL string on success.
 * If Catbox returns an empty response or throws, the caller should fallback.
 */
async function uploadToCatbox(filePath) {
  const uploadForm = new FormData();
  uploadForm.append('reqtype', 'fileupload');
  uploadForm.append('fileToUpload', fs.createReadStream(filePath));

  const postHeaders = {
    ...uploadForm.getHeaders(),
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Origin': 'https://catbox.moe',
    'Referer': 'https://catbox.moe/'
  };

  const response = await axios.post('https://catbox.moe/user/api.php', uploadForm, {
    headers: postHeaders,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 30000
  });

  if (response.status !== 200) {
    throw new Error(`Catbox upload failed with status ${response.status}`);
  }
  const data = response.data;
  // Catbox returns the file URL as a plain text string; trim it.
  const url = typeof data === 'string' ? data.trim() : '';
  return url;
}

/**
 * Unified upload helper – try Catbox first, then GoFile fallback.
 * @param {string} filePath Absolute path to the video file.
 * @returns {Promise<string>} URL of the uploaded video.
 */
async function uploadVideo(filePath) {
  // Attempt Catbox upload.
  try {
    const catUrl = await uploadToCatbox(filePath);
    if (catUrl) {
      console.log(`🎯 Catbox upload successful. URL: ${catUrl}`);
      return catUrl;
    }
    console.warn('⚠️ Catbox returned empty URL, falling back to GoFile');
  } catch (err) {
    console.error('❌ Catbox upload error:', err.message);
  }

  // Fallback to GoFile.
  try {
    const goUrl = await uploadToGoFile(filePath);
    console.log(`🎯 GoFile upload successful. URL: ${goUrl}`);
    return goUrl;
  } catch (err) {
    console.error('❌ GoFile upload error:', err.message);
    throw err; // rethrow to signal total failure
  }
}

module.exports = { uploadVideo };
