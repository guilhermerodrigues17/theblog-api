import { BadRequestException } from '@nestjs/common';
import multer from 'multer';

export const storage = multer.memoryStorage();

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('only image types are allowed'), false);
  }
  cb(null, true);
};
