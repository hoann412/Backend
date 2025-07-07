import multer from 'multer';
import { BadRequestError } from '../errors/customError.js';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/)) {
            return cb(new BadRequestError('Chỉ chấp nhận nhưng file có đuôi là JPG, JPEG, và PNG!'));
        }
        if (file.size > 5 * 1024 * 1024) {
            return cb(new BadRequestError('Dung lượng file phải bé hơn 5MB!'));
        }

        cb(null, true);
    },
});

export default upload;
