const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Upload a file to GoFile.io and return the download page URL.
 * @param {string} filePath Absolute path to the video file.
 * @returns {Promise<string>} The download page URL.
 */
async function uploadToGoFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const response = await axios.post('https://store2.gofile.io/uploadFile', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*'
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 30000
  });
  if (response.status !== 200) {
    throw new Error(`GoFile upload failed with status ${response.status}`);
  }
  const data = response.data;
  if (!data || !data.data || !data.data.downloadPage) {
    throw new Error('GoFile response missing downloadPage');
  }
  return data.data.downloadPage;
}

module.exports = { uploadToGoFile };
