/**
 * @file media.js
 * @description Helpers for handling image/audio files, conversion, and resizing.
 * @module utils/media
 */

/**
 * Convert a File or Blob into a base64 Data URL.
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resize and compress an image file to maintain good performance.
 * @param {File} file
 * @param {number} [maxWidth=800]
 * @param {number} [maxHeight=800]
 * @param {number} [quality=0.85]
 * @returns {Promise<string>} Data URL
 */
export async function resizeImage(file, maxWidth = 800, maxHeight = 800, quality = 0.85) {
  const dataUrl = await fileToDataURL(file);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/webp', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Generate a small thumbnail from an image file.
 * @param {File} file
 * @param {number} [size=120]
 * @returns {Promise<string>}
 */
export function generateThumbnail(file, size = 120) {
  return resizeImage(file, size, size, 0.7);
}

