import { Injectable } from '@nestjs/common';
import { MulterFile } from 'src/interfaces/Multerfile.interface';

@Injectable()
export class UploadService {
	// For now we just return the filename and path - persistence handled elsewhere (e.g., Car service)
	async uploadFile(file: MulterFile) {
		return {
			filename: file.filename,
			originalname: file.originalname,
			mimetype: file.mimetype,
			size: file.size,
			destination: file.destination,
			path: file.path,
		};
	}
}
