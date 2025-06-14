// shared/Util.js

export const resizeImage = (file, maxWidth = 1024, maxHeight = 768, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width <= maxWidth && height <= maxHeight) {
          return resolve(event.target.result);
        }

        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const resizedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(resizedBase64);
      };
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
};
