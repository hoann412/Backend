import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/customError.js';
import Product from '../models/product.js';
import APIQuery from '../utils/APIQuery.js';
import { removeUploadedFile, uploadFiles } from '../utils/upload.js';
import { clientRequiredFields } from '../helpers/filterRequiredClient.js';
import customResponse from '../helpers/response.js';

function hasDuplicates(array) {
    return new Set(array).size !== array.length;
}
export const getAllProducts = async (query) => {
    const features = new APIQuery(
        Product.find().populate('variants.color').populate('variants.size').populate('category').populate('tags'),
        query,
    );
    features.filter().sort().limitFields().search().paginate();

    const [products, totalDocs] = await Promise.all([features.query, features.count()]);
    return { products, totalDocs };
};
export const getBestSellingProducts = async () => {
    const products = await Product.find({ ...clientRequiredFields })
        .populate('variants.color')
        .populate('variants.size')
        .sort({ sold: -1 })
        .limit(10);
    return products;
};
export const getDiscountProducts = async () => {
    const products = await Product.find({ ...clientRequiredFields })
        .populate('variants.color')
        .populate('variants.size')
        .sort({ discount: -1 })
        .limit(10);
    return products;
};

export const createProduct = async (productData, files) => {
    let variationList;
    const checkName = await Product.findOne({ name: productData.name });
    if (checkName && checkName._id.toString() !== productId) {
        throw new BadRequestError('Tên sản phẩm đã tồn tại');
    }
    // @upload images
    if (files && files['variantImages']) {
        const { fileUrls, fileUrlRefs, originNames } = await uploadFiles(files['variantImages']);
        const variants = JSON.parse(productData.variantString);
        const map = {};
        variants.forEach((element) => {
            const key = element.size + element.color;
            if (map[key]) {
                // throw new BadRequestError("Biến thể không được trùng nhau");
            } else {
                map[key] = 1;
            }
        });
        if (hasDuplicates(variants.map((item) => item.imageUrlRef))) {
            throw new BadRequestError('File ảnh không được trùng nhau');
        }

        variationList = fileUrls.map((item, i) => {
            const variation = variants.find((obj) => {
                const originName = originNames[i];

                const fileName = obj.imageUrlRef;
                return fileName === originName;
            });
            if (variation) {
                return { ...variation, image: item, imageUrlRef: fileUrlRefs[i] };
            }
        });
    }

    delete productData.variantImages;
    delete productData.variantString;

    // @add variants to product
    const newProduct = new Product({
        ...productData,
        tags: productData.tags ? productData.tags.split(',') : [],
        variants: variationList,
    });

    await newProduct.save();
    return newProduct;
};

// @PUT: updateProduct
export const updateProduct = async (productId, oldImageUrlRefs, files, variants, productNew) => {
    const product = await Product.findById(productId);
    let newVariants = [];
    let oldVariants = [];
    const checkName = await Product.findOne({ name: productNew.name });
    if (checkName && checkName._id.toString() !== productId) {
        throw new BadRequestError('Tên sản phẩm đã tồn tại');
    }
    // if (hasDuplicates(variants.map((item) => item.imageUrlRef))) {
    //   throw new BadRequestError("File ảnh không được trùng nhau");
    // }
    const map = {};
    variants.forEach((element) => {
        const key = element.size + element.color;
        if (map[key]) {
            throw new BadRequestError('Biến thể không được trùng nhau');
        } else {
            map[key] = 1;
        }
    });
    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${productId}`);

    // @upload images
    if (files && files['variantImages']) {
        const { fileUrls, fileUrlRefs, originNames } = await uploadFiles(files['variantImages']);
        // @map new images to variants
        newVariants = fileUrls.map((item, i) => {
            const variation = variants.find((obj) => {
                const originName = originNames[i];
                const fileName = obj.imageUrlRef;
                return fileName === originName;
            });
            if (variation) {
                return { ...variation, image: item, imageUrlRef: fileUrlRefs[i] };
            } else {
                return variants[i];
            }
        });
        oldVariants = variants.filter((item) => item.image);
    } else {
        newVariants = variants;
    }

    const tags = productNew.tags ? productNew.tags.split(',') : product.tags;

    // @update product
    product.set({
        ...productNew,
        variants: [...newVariants, ...oldVariants],
        tags,
    });
    return await product.save();
};

// @details
export const getProductById = async (productId) => {
    const product = await Product.findOne({
        _id: productId,
        ...clientRequiredFields,
    })
        .populate('variants.color')
        .populate('variants.size');
    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${productId}`);

    return product;
};
// @details for admin
export const getProductByIdForAdmin = async (productId) => {
    const product = await Product.findOne({
        _id: productId,
    })
        .populate('variants.color')
        .populate('variants.size');
    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${productId}`);

    return product;
};

// @PATCH: hiddenProduct
export const hiddenProduct = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findOneAndUpdate({ _id: id, isActive: true }, { isActive: false }, { new: true });

    if (!product) {
        throw new NotFoundError(`Không tìm thấy sản phẩm này: ${id}`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: product,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @PATCH: showProduct
export const showProduct = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findOneAndUpdate({ _id: id, isActive: false }, { isActive: true }, { new: true });

    if (!product) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${id}`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: product,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
export const getRelatedProducts = async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('variants.color').populate('variants.size').lean();

    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);

    const products = await Product.find({ tags: { $in: product.tags }, ...clientRequiredFields }).limit(10);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
