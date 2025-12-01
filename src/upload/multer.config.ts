import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig = {
  storage: diskStorage({
    destination: './public/img',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const sanitized = file.originalname.replace(/\s+/g, '_');
      callback(null, uniqueSuffix + '-' + sanitized);
    },
  }),
};

export const multerOptions: MulterOptions = {
  ...multerConfig,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowed = /\.(webp|jpg|jpeg|png)$/i;
    if (!allowed.test(file.originalname)) {
      return callback(new Error('Invalid file type'), false);
    }
    callback(null, true);
  },
};
