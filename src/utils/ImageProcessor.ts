type WatermarkPosition = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right';
type ImageFormat = 
  | 'jpeg' 
  | 'png' 
  | 'webp' 
  | 'bmp';

class ImageProcessor {
  private canvas: OffscreenCanvas | HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image!: HTMLImageElement | ImageBitmap;
  private width!: number;
  private height!: number;

  constructor(private file: File | Blob) {
    if (typeof OffscreenCanvas !== 'undefined') {
      this.canvas = new OffscreenCanvas(1, 1);
    } else {
      this.canvas = document.createElement('canvas');
    }
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context for canvas');
    }
    this.context = ctx as CanvasRenderingContext2D;
  }

  static async fromUrl(url: string): Promise<ImageProcessor> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new ImageProcessor(blob);
  }

  private async loadImage(): Promise<void> {
    if (typeof ImageBitmap !== 'undefined') {
      this.image = await createImageBitmap(this.file);
      this.width = this.image.width;
      this.height = this.image.height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context.drawImage(this.image, 0, 0);
    } else {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.image = img;
          this.width = img.width;
          this.height = img.height;
          this.canvas.width = this.width;
          this.canvas.height = this.height;
          this.context.drawImage(img, 0, 0);
          resolve();
        };
        img.onerror = (
          message, source, lineno, colno, error
        ) => {
          const errorMessage = error 
            ? error.message 
            : message 
              ? `Failed to load image: ${message}` 
              : 'Failed to load image: Unknown error';
          reject(new Error(errorMessage));
        };
        img.src = URL.createObjectURL(this.file);
      });
    }
  }

  async compress(options: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    format: ImageFormat;
  }): Promise<Blob> {
    await this.loadImage();
    
    const { maxWidth, maxHeight, quality, format } = options;
    let newWidth = this.width;
    let newHeight = this.height;
    
    if (newWidth > maxWidth) {
      newHeight = (newHeight * maxWidth) / newWidth;
      newWidth = maxWidth;
    }
    
    if (newHeight > maxHeight) {
      newWidth = (newWidth * maxHeight) / newHeight;
      newHeight = maxHeight;
    }
    
    const tempCanvas = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(newWidth, newHeight)
      : document.createElement('canvas');
      
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      throw new Error('Failed to get 2D context for temporary canvas');
    }
    
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    
    (tempCtx as any).drawImage(
      this.image as HTMLImageElement | ImageBitmap,
      0, 0, this.width, this.height,
      0, 0, newWidth, newHeight
    );
    
    if (typeof OffscreenCanvas !== 'undefined') {
      return (tempCanvas as any).convertToBlob({
        type: `image/${format}`,
        quality: quality
      });
    } else {
      return new Promise((resolve, reject) => {
        (tempCanvas as any).toBlob(
          (blob: any) => {
            if (!blob) {
              reject(new Error('Failed to create blob from canvas'));
              return;
            }
            resolve(blob);
          },
          `image/${format}`,
          quality
        );
      });
    }
  }

  async addTextWatermark(
    text: string,
    font: string = '24px Arial',
    color: string = 'rgba(255, 255, 255, 0.5)',
    position: WatermarkPosition = 'bottom-right',
    opacity: number = 1
  ): Promise<Blob> {
    await this.loadImage();
    
    this.context.font = font;
    this.context.fillStyle = color;
    this.context.globalAlpha = opacity;
    
    const textMetrics = this.context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(font, 10) || 24;
    
    let x = 10;
    let y = 10;
    
    switch (position) {
      case 'top-right':
        x = this.width - textWidth - 10;
        break;
      case 'bottom-left':
        y = this.height - 10;
        break;
      case 'bottom-right':
        x = this.width - textWidth - 50;
        y = this.height - 50;
        break;
    }
    
    this.context.fillText(text, x, y + textHeight / 2);
    
    return this.exportImage();
  }

  async addImageWatermark(
    watermarkImage: File | Blob | string,
    position: WatermarkPosition = 'bottom-right',
    scale: number = 0.2,
    opacity: number = 0.7
  ): Promise<Blob> {
    await this.loadImage();
    
    let watermark: HTMLImageElement | ImageBitmap;
    
    if (typeof watermarkImage === 'string') {
      const response = await fetch(watermarkImage);
      const blob = await response.blob();
      
      if (typeof ImageBitmap !== 'undefined') {
        watermark = await createImageBitmap(blob);
      } else {
        watermark = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = URL.createObjectURL(blob);
        });
      }
    } else {
      if (typeof ImageBitmap !== 'undefined') {
        watermark = await createImageBitmap(watermarkImage);
      } else {
        watermark = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = URL.createObjectURL(watermarkImage);
        });
      }
    }
    
    const watermarkWidth = watermark.width * scale;
    const watermarkHeight = watermark.height * scale;
    
    let x = 10;
    let y = 10;
    
    switch (position) {
      case 'top-right':
        x = this.width - watermarkWidth - 10;
        break;
      case 'bottom-left':
        y = this.height - watermarkHeight - 10;
        break;
      case 'bottom-right':
        x = this.width - watermarkWidth - 10;
        y = this.height - watermarkHeight - 10;
        break;
    }
    
    this.context.globalAlpha = opacity;
    this.context.drawImage(
      watermark as HTMLImageElement | ImageBitmap,
      x, y,
      watermarkWidth, watermarkHeight
    );
    this.context.globalAlpha = 1;
    
    return this.exportImage();
  }

  async crop(
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<Blob> {
    await this.loadImage();
    
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + width > this.width) width = this.width - x;
    if (y + height > this.height) height = this.height - y;
    
    const tempCanvas = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(width, height)
      : document.createElement('canvas');
      
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      throw new Error('Failed to get 2D context for cropping canvas');
    }
    
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    (tempCtx as any).drawImage(
      this.image as HTMLImageElement | ImageBitmap,
      x, y, width, height,
      0, 0, width, height
    );
    
    if (typeof OffscreenCanvas !== 'undefined') {
      return (tempCanvas as any).convertToBlob({
        type: 'image/webp',
        quality: 0.8
      });
    } else {
      return new Promise((resolve, reject) => {
        (tempCanvas as any).toBlob(
          (blob: any) => {
            if (!blob) {
              reject(new Error('Failed to create blob from canvas'));
              return;
            }
            resolve(blob);
          },
          'image/webp',
          0.8
        );
      });
    }
  }

  async adjustBrightness(factor: number): Promise<Blob> {
    await this.loadImage();
    
    const imageData = this.context.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + factor));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + factor));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + factor));
    }
    
    this.context.putImageData(imageData, 0, 0);
    
    return this.exportImage();
  }

  async adjustContrast(factor: number): Promise<Blob> {
    await this.loadImage();
    
    const imageData = this.context.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    
    const contrast = (factor + 100) / 100;
    const contrastSquared = contrast * contrast;
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] - 128;
      let g = data[i + 1] - 128;
      let b = data[i + 2] - 128;
      
      r = r * contrastSquared;
      g = g * contrastSquared;
      b = b * contrastSquared;
      
      data[i] = Math.min(255, Math.max(0, r + 128));
      data[i + 1] = Math.min(255, Math.max(0, g + 128));
      data[i + 2] = Math.min(255, Math.max(0, b + 128));
    }
    
    this.context.putImageData(imageData, 0, 0);
    
    return this.exportImage();
  }

  private exportImage(): Promise<Blob> {
    if (typeof OffscreenCanvas !== 'undefined') {
      return (this.canvas as any).convertToBlob({
        type: 'image/webp',
        quality: 0.8
      });
    } else {
      return new Promise((resolve, reject) => {
        (this.canvas as any).toBlob(
          (blob: any) => {
            if (!blob) {
              reject(new Error('Failed to create blob from canvas'));
              return;
            }
            resolve(blob);
          },
          'image/webp',
          0.8
        );
      });
    }
  }
}

export default ImageProcessor;