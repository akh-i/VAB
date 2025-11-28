
export const cleanJsonString = (str: string): string => {
  // Remove markdown code blocks if present
  let cleaned = str.replace(/```json/g, '').replace(/```/g, '');
  
  // Find the first opening brace and last closing brace
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Remove control characters (ASCII 0-31) except newlines/tabs that might be valid in JSON formatting 
  // (though strict JSON shouldn't have real newlines in strings, we trust the parser or the prompt to escape them)
  // We aggressively strip characters that cause "Bad control character" errors.
  cleaned = cleaned.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '');

  return cleaned;
};

export const formatCurrency = (amount: string | number | undefined | null, currency: string) => {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  
  // Simple heuristic cleanup for price strings like "$129.99" -> 129.99
  // Also handles "₹ 1,49,999" inputs to just get numbers
  const num = parseFloat(amount.toString().replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return amount.toString();
  
  // Use en-IN for Indian Rupees formatting (e.g. 1,00,000)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0, // Usually integers in India for prices
  }).format(num);
};

export const processImage = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to prevent large payloads causing 500/XHR errors
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1024; // Limit max dimension to 1024px

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG 0.8 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64Content = dataUrl.split(',')[1];
        
        resolve({
          inlineData: {
            data: base64Content,
            mimeType: 'image/jpeg',
          },
        });
      };
      img.onerror = (e) => reject(new Error("Failed to load image for processing"));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (e) => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
