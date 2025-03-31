/**
 * Compresses an image file to reduce its size
 * @param {File} file - The image file to compress
 * @param {number} [maxSizeMB=1] - Maximum size in MB
 * @param {number} [maxWidthOrHeight=1024] - Maximum width or height in pixels
 * @returns {Promise<File>} - Compressed image file
 */
const compressImage = (
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1024
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Read the file as a data URL
    reader.readAsDataURL(file);

    reader.onload = (event: ProgressEvent<FileReader>) => {
      // Type assertion for result to be a string
      const result = event.target?.result as string | null;

      if (!result) {
        reject(new Error("File reading failed."));
        return;
      }

      const img = new Image();
      img.src = result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Scale down if necessary
        if (width > height && width > maxWidthOrHeight) {
          height = Math.round((height * maxWidthOrHeight) / width);
          width = maxWidthOrHeight;
        } else if (height > maxWidthOrHeight) {
          width = Math.round((width * maxWidthOrHeight) / height);
          height = maxWidthOrHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas rendering context is not available."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob with reduced quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed."));
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          0.7 // Quality (0.7 = 70% quality)
        );
      };

      img.onerror = (error) =>
        reject(new Error(`Image loading failed: ${error}`));
    };

    reader.onerror = (error) =>
      reject(new Error(`File reading failed: ${error}`));
  });
};
