import ImageProcessor from './ImageProcessor';

class FileReaderUtil {
  public static readAsText(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const result = reader.result as string;
              resolve(result);
          };
          reader.onerror = () => {
              reject(reader.error);
          };
          reader.readAsText(file);
      });
  }

  public static readAsDataURL(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const result = reader.result as string;
              resolve(result);
          };
          reader.onerror = () => {
              reject(reader.error);
          };
          reader.readAsDataURL(file);
      });
  }

  public static readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const result = reader.result as ArrayBuffer;
              resolve(result);
          };
          reader.onerror = () => {
              reject(reader.error);
          };
          reader.readAsArrayBuffer(file);
      });
  }

  public static async readAndCompressImage(file: File, options: {
      maxWidth: number;
      maxHeight: number;
      quality: number;
      format: string;
  }): Promise<File> {
      const processor = new ImageProcessor(file);
      return await processor.compress(options as any) as any;
  }

  public static async readAndAddTextWatermark(
    file: File, 
    text: string, 
    font: string, 
    color: string, 
    position: 
      'top-left' 
      | 'top-right' 
      | 'bottom-left' 
      | 'bottom-right',
      opacity: number = 1
  ): Promise<File> {
      const processor = new ImageProcessor(file);
      return await processor.addTextWatermark(
        text, 
        font, color, 
        position, opacity
      ) as any;
  }
}

export default FileReaderUtil;