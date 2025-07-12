import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { BadRequestError, DuplicateError, UnAuthenticatedError } from '../errors/customError.js';
import User from '../models/user.js';
import customResponse from '../helpers/response.js';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import { envConfig } from '../config/env.js';
import { generateToken, saveToken } from './token.service.js';
import { sendMail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';

// @POST register
export const register = async (req, res, next) => {
    const foundedUser = await User.findOne({ email: req.body.email }).lean();

    if (foundedUser) {
        throw new DuplicateError('Email đã tồn tại!');
    }

    const user = await User.create(req.body);
    const payload = {
        userId: user._id,
        role: user.role,
    };
    const verifyToken = generateToken(payload, envConfig.JWT_VERIFY, '3m');
    await saveToken(verifyToken, user, 'verify');
    const contentEmail = {
        subject: '[BITTIS] - Kích Hoạt Tài Khoản',
        content: {
            title: 'Kích Hoạt Tài Khoản Của Bạn',
            warning: 'Nếu bạn không kích hoạt tài khoản, bạn sẽ không sử dụng được toàn bộ dịch vụ của chúng tôi',
            description:
                'Cảm ơn bạn vì đã lựa chọn BITTIS! Để hoàn tất việc đăng ký tài khoản, vui lòng nhấn vào đường dẫn dưới đây:',
            email: req.body.email,
        },
        link: {
            linkName: 'Kích Hoạt Tài Khoản',
            linkHerf: `http://localhost:3000/verifyAccount?tk=${verifyToken}&email=${user.email}`,
        },
    };
    sendMail({ email: req.body.email, template: contentEmail, type: 'Verify' });
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: user,
            message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác minh tài khoản',
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @POST login
export const login = async (req, res, next) => {
    const foundedUser = await User.findOne({ email: req.body.email });

    if (!foundedUser) {
        throw new BadRequestError('Thông tin đăng nhập không chính xác');
    }

    const payload = {
        userId: foundedUser._id,
        role: foundedUser.role,
    };

    const isCompared = await bcrypt.compare(req.body.password, foundedUser.password);

    if (!isCompared) {
        throw new BadRequestError('Thông tin đăng nhập không chính xác');
    }
    if (!foundedUser.isActive) {
         const verifyToken = generateToken(payload, envConfig.JWT_VERIFY, '3m');
    await saveToken(verifyToken, foundedUser, 'verify');
    const contentEmail = {
        subject: '[BITTIS] - Kích Hoạt Tài Khoản',
        content: {
            title: 'Kích Hoạt Tài Khoản Của Bạn',
            warning: 'Nếu bạn không kích hoạt tài khoản, bạn sẽ không sử dụng được toàn bộ dịch vụ của chúng tôi',
            description:
                'Cảm ơn bạn vì đã lựa chọn BITTIS! Để hoàn tất việc đăng ký tài khoản, vui lòng nhấn vào đường dẫn dưới đây:',
            email: req.body.email,
        },
        link: {
            linkName: 'Kích Hoạt Tài Khoản',
            linkHerf: `http://localhost:3000/verifyAccount?tk=${verifyToken}&email=${foundedUser.email}`,
        },
    };
    sendMail({ email: req.body.email, template: contentEmail, type: 'Verify' });
        throw new BadRequestError('Tài khoản của bạn chưa được kích hoạt vui lòng kiểm tra lại email');
    }
    const accessToken = generateToken(payload, envConfig.JWT_SECRET, '123423d');

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: { user: foundedUser, accessToken },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @GET logout
export const logout = async (req, res, next) => {};
// @ResetPassword
export const sendMailForgotPassword = async (req, res, next) => {
    const checkedEmail = await User.findOne({ email: req.body.email }).lean();
    if (!checkedEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json(
            customResponse({
                data: {
                    field: 'email',
                    message: 'Email chưa được đăng ký',
                },
                message: 'Error Email',
                status: 400,
                success: false,
            }),
        );
    }
    const generateRandomPassword = (length = 8) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    };
    const newPassword = generateRandomPassword();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await User.findByIdAndUpdate(checkedEmail._id, { password: hashedPassword });
    const contentEmail = {
        subject: '[BITTIS] - Phục hồi mật khẩu của bạn',
        content: {
            title: 'Phục Hồi Lại Mật Khẩu Của Bạn',
            warning: 'Cảnh báo: Không chia sẻ mail này cho bất kỳ ai khác',
            description: `Mật khẩu mới của bạn là: ${newPassword}`,
            email: req.body.email,
        },
        link: {
            linkName: 'Bấm vào đây để đăng nhập',
            linkHerf: `http://localhost:3000/login`,
        },
    };
    sendMail({
        email: req.body.email,
        template: contentEmail,
        type: 'ResetPassword',
    });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: 'Vui Lòng Kiểm Tra Email',
            success: true,
            status: StatusCodes.NO_CONTENT,
        }),
    );
};
// @Send Verify account
export const sendMailverifyAccount = async (req, res, next) => {
    const checkedEmail = await User.findOne({ email: req.body.email }).lean();
    if (checkedEmail?.isActive) {
        throw new BadRequestError('Người dùng này đã được kích hoạt!');
    }
    if (!checkedEmail) {
        throw new BadRequestError('Không tìm thấy người dùng này!');
    }
    const verifyToken = generateToken(checkedEmail, envConfig.JWT_VERIFY, '5m');
    await saveToken(verifyToken, checkedEmail._id.toString(), 'verify');
    const contentEmail = {
        subject: '[BITTIS] - Kích Hoạt Tài Khoản',
        content: {
            title: 'Kích Hoạt Tài Khoản Của Bạn',
            warning: 'Nếu bạn không kích hoạt tài khoản, bạn sẽ không sử dụng được toàn bộ dịch vụ của chúng tôi',
            description:
                'Cảm ơn bạn vì đã lựa chọn BITTIS! Để hoàn tất việc đăng ký tài khoản, vui lòng nhấn vào đường dẫn dưới đây:',
            email: req.body.email,
        },
        link: {
            linkName: 'Kích Hoạt Tài Khoản',
            linkHerf: `http://localhost:3000/verifyAccount/?tk=${verifyToken}&email=${checkedEmail.email}`,
        },
    };
    sendMail({ email: req.body.email, template: contentEmail, type: 'Verify' });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: 'Vui Lòng Kiểm Tra Email',
            success: true,
            status: StatusCodes.NO_CONTENT,
        }),
    );
};
// @Verify account
export const verifyEmail = async (req, res, next) => {
    const token = req.body.token || req.body.token;
    jwt.verify(token, envConfig.JWT_VERIFY, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new UnAuthenticatedError('Mã đã hết hạn'));
            }
            if (err.name === 'JsonWebTokenError') {
                return next(new UnAuthenticatedError('Mã không hợp lệ'));
            }
            return next(new UnAuthenticatedError('Xác thực thất bại vui lòng thử lại!'));
        }
        const { userId } = decoded;
        await User.findByIdAndUpdate(userId, { isActive: true });
        return res.status(StatusCodes.ACCEPTED).json(
            customResponse({
                data: null,
                status: StatusCodes.ACCEPTED,
                success: true,
                message: 'Tài khoản của bạn đã được kích hoạt thành công',
            }),
        );
    });
};
