export const LOGO_SRC = '/logo.png';
const WHITE_FLOOR = 225;
const FADE_START = 180;

let cached: Promise<string> | null = null;

function removeWhiteBackground(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas indisponible'));
        return;
      }
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const lowestChannel = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
        if (lowestChannel >= WHITE_FLOOR) {
          pixels[i + 3] = 0;
        } else if (lowestChannel > FADE_START) {
          pixels[i + 3] = Math.round((255 * (WHITE_FLOOR - lowestChannel)) / (WHITE_FLOOR - FADE_START));
        }
      }
      context.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject(new Error('Logo introuvable'));
    image.src = src;
  });
}

export function getTransparentLogo(): Promise<string> {
  cached ??= removeWhiteBackground(LOGO_SRC);
  return cached;
}
