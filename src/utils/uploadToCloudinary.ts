import cloudinary from '@/libs/cloudinary';

export const uploadToCloudinary = async (file: File, folder: string) => {
  try {
    const buffer = await file.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        resource_type: 'auto',
        folder,
        chunk_size: 6000000,
        format: 'webp',
      }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });

      stream.write(nodeBuffer);
      stream.end();
    });
  } catch (error) {
    throw error;
  }
};

export const uploadImageWithOptions = async (
  file: File,
  folder: string,
  darkWatermark?: string,
  lightWatermark?: string
) => {
  try {
    // 构建 Cloudinary 的上传参数
    const uploadOptions: any = {
      folder,
      format: 'webp',
      transformation: [],
    };

    // 添加暗水印
    if (darkWatermark) {
      uploadOptions.transformation?.push({
        color: 'rgba(0,0,0,0.2)',
        gravity: 'center',
        x: 0,
        y: 0,
        overlay: {
          font_family: 'Arial',
          font_size: 30,
          font_weight: 'bold',
          text: darkWatermark,
        },
      });
    }

    // 添加明水印
    if (lightWatermark) {
      // you also can use format config to add watarmark
      uploadOptions.transformation?.push({
        color: 'white',
        gravity: 'south_east',
        x: 10,
        y: 10,
        overlay: {
          font_family: 'Arial',
          font_size: 30,
          font_weight: 'bold',
          text: lightWatermark,
        },
      });
    }

    const buffer = await file.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);

    return new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.write(nodeBuffer);
      uploadStream.end();
    });
  } catch (error) {
    throw error;
  }
};

export const uploadVideoToCloudinary = async (
  file: File,
  folder: string
) => {
  return uploadToCloudinary(file, folder);
};