import { BadRequestError, NotFoundError } from '../errors/customError.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '../helpers/response.js';
import APIQuery from '../utils/APIQuery.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { removeUploadedFile, uploadSingleFile } from '../utils/upload.js';
import { clientRequiredFields } from '../helpers/filterRequiredClient.js';

// GET: Get all users
// @Get: getAllUsers
export const getAllUsers = async (req, res) => {
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);

    const features = new APIQuery(User.find({role:'user'}).select('-password'), req.query);
    features.filter().sort().limitFields().search().paginate();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                users: data,
                page: page,
                totalDocs: totalDocs,
                totalPages: totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Patch change password
export const changePassword = async (req, res, next) => {
    const { password, newPassword } = req.body;
    const user = await User.findOne({ _id: req.userId });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new BadRequestError('Mật khẩu cũ không chính xác');
    }

    user.password = newPassword;
    await user.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
// @Patch forgot password
export const forgotPassword = async (req, res, next) => {
    const user = await User.findById(req.userId);
    user.password = req.body.password;
    await user.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Get get user profile
export const getProfile = async (req, res, next) => {
    const user = await User.findById(req.userId);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: user,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Patch update user profile
export const updateProfile = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (req.files['avatar']) {
        const { downloadURL, imageUrlRef } = await uploadSingleFile(...req.files['avatar']);
        user.avatar = downloadURL;
        user.imageUrlRef = imageUrlRef;

        if (user.imageUrlRef) {
            removeUploadedFile(user.imageUrlRef);
        }
    }
    user.set(req.body);
    await user.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Patch: Add wishlist
export const addWishList = async (req, res) => {
    const userId = req.userId;
    const productId = req.body.productId;
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { wishList: productId } }, { new: true }).lean();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: user,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @Patch: delete wishlist
export const deleteWishList = async (req, res) => {
    const userId = req.userId;
    const productId = req.body.productId;
    const user = await User.findByIdAndUpdate(userId, { $pull: { wishList: productId } }, { new: true }).lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: user,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @Get: get wishlist by user
export const getWishListByUser = async (req, res) => {
    const userId = req.userId;

    const wishlist = await User.findById(userId)
        .select('wishList')
        .populate({
            path: 'wishList',
            match: clientRequiredFields,
            populate: [
                {
                    path: 'variants',
                    select: 'color size stock image imageUrlRef',
                    populate: [
                        {
                            path: 'color',
                            select: 'name hex',
                        },
                        {
                            path: 'size',
                            select: 'name',
                        },
                    ],
                },
            ],
            select: 'name price discount variants description rating reviewCount',
        })
        .lean();

    if (!wishlist) {
        throw new NotFoundError('Không tìm thấy wishlist');
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: wishlist,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
