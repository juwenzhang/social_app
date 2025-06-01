class ImageProcessor {
  public file: File;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;

  constructor(file: File) {
    this.file = file;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.image = new Image();
  }

  private loadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.image.onload = () => {
        resolve();
      };
      this.image.onerror = (error) => {
        reject(error);
      };
      this.image.src = URL.createObjectURL(this.file);
    });
  }

  async compress(options: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    format: string;
  }): Promise<File> {
    await this.loadImage();
    const { maxWidth, maxHeight, quality, format } = options;
    const { width, height } = this.image;
    let newWidth = width;
    let newHeight = height;
    const scale = Math.min(maxWidth / width, maxHeight / height);
    newWidth *= scale;
    newHeight *= scale;

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.context.drawImage(this.image, 0, 0, newWidth, newHeight);

    const dataUrl = this.canvas.toDataURL(`image/${format}`, quality);
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob], 
      this.file.name, 
      { type: `image/${format}` }
    );
  }

  async addImageWatermark(
    watermarkImage: File,
    position: 
      'top-left' 
      | 'top-right' 
      | 'bottom-left' 
      | 'bottom-right' 
      = 'bottom-right',
    opacity: number = 0.5
  ): Promise<File> {
    await this.loadImage();
    const watermark = new Image();
    watermark.src = URL.createObjectURL(watermarkImage);
    await new Promise((resolve, reject) => {
      watermark.onload = () => {
        resolve(null);
      };
      watermark.onerror = (error) => {
        reject(error);
      };
    });

    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.context.drawImage(this.image, 0, 0);
    this.context.globalAlpha = opacity;

    let x = 0;
    let y = 0;
    switch (position) {
      case 'top-left':
        x = 10;
        y = 10;
        break;
      case 'top-right':
        x = this.canvas.width - watermark.width - 10;
        y = 10;
        break;
      case 'bottom-left':
        x = 10;
        y = this.canvas.height - watermark.height - 10;
        break;
      case 'bottom-right':
        x = this.canvas.width - watermark.width - 10;
        y = this.canvas.height - watermark.height - 10;
        break;
    }

    this.context.drawImage(watermark, x, y);
    this.context.globalAlpha = 1;

    const dataUrl = this.canvas.toDataURL(this.file.type);
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob], 
      this.file.name, 
      { type: this.file.type }
    );
  }

  async convertToGrayscale(): Promise<File> {
    await this.loadImage();
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.context.drawImage(this.image, 0, 0);

    const imageData = this.context.getImageData(
      0, 
      0, 
      this.canvas.width, 
      this.canvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = 
        0.299 * data[i] 
        + 0.587 * data[i + 1] 
        + 0.114 * data[i + 2];
      data[i] = avg;     // R
      data[i + 1] = avg; // G
      data[i + 2] = avg; // B
    }

    this.context.putImageData(imageData, 0, 0);

    const dataUrl = this.canvas.toDataURL(this.file.type);
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob], 
      this.file.name, 
      { type: this.file.type }
    );
  }

  async addTextWatermark(
    text: string,
    font: string,
    color: string,
    position: 
      'top-left' 
      | 'top-right' 
      | 'bottom-left' 
      | 'bottom-right',
    opacity: number = 0.5
  ): Promise<File> {
    await this.loadImage();
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.context.drawImage(this.image, 0, 0);
    this.context.globalAlpha = opacity;
    this.context.font = font;
    this.context.fillStyle = color;

    const textMetrics = this.context.measureText(text);
    let x = 0;
    let y = 0;
    switch (position) {
      case 'top-left':
        x = 10;
        y = 30;
        break;
      case 'top-right':
        x = this.canvas.width - textMetrics.width - 10;
        y = 30;
        break;
      case 'bottom-left':
        x = 10;
        y = this.canvas.height - 10;
        break;
      case 'bottom-right':
        x = this.canvas.width - textMetrics.width - 10;
        y = this.canvas.height - 10;
        break;
    }

    this.context.fillText(text, x, y);
    this.context.globalAlpha = 1;

    const dataUrl = this.canvas.toDataURL(this.file.type);
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob], 
      this.file.name, 
      { type: this.file.type }
    );
  }

  async rotate(angle: number): Promise<File> {
    await this.loadImage();
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const newWidth = Math.abs(
      this.image.width * cos) 
      + Math.abs(this.image.height * sin  
    );
    const newHeight = Math.abs(
      this.image.width * sin) 
      + Math.abs(this.image.height * cos
    );

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.context.translate(newWidth / 2, newHeight / 2);
    this.context.rotate(radians);
    this.context.drawImage(
      this.image, 
      -this.image.width / 2, 
      -this.image.height / 2
    );

    const dataUrl = this.canvas.toDataURL(this.file.type);
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob], 
      this.file.name, 
      { type: this.file.type }
    );
  }

  async flip(direction: 'horizontal' | 'vertical'): Promise<File> {
    await this.loadImage();
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;

    this.context.save();
    if (direction === 'horizontal') {
      this.context.scale(-1, 1);
      this.context.drawImage(this.image, -this.image.width, 0);
    } else {
      this.context.scale(1, -1);
      this.context.drawImage(this.image, 0, -this.image.height);
    }
    this.context.restore();

    const dataUrl = this.canvas.toDataURL(this.file.type);
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob], 
      this.file.name, 
      { type: this.file.type }
    );
  }

  async crop(
    x: number, 
    y: number, 
    width: number, 
    height: number
  ): Promise<File> {
    await this.loadImage();
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.drawImage(
      this.image, x, y, width, 
      height, 0, 0, width, height
    );

    const dataUrl = this.canvas.toDataURL(this.file.type);
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob], 
      this.file.name, 
      { type: this.file.type }
    );
  }

  static async fromUrl(url: string): Promise<ImageProcessor> {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File(
      [blob], 
      'image', 
      { type: blob.type }
    );
    return new ImageProcessor(file);
  }
}

export default ImageProcessor;
