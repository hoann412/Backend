import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/customError.js';
import customResponse from '../helpers/response.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';
import { clientRequiredFields } from '../helpers/filterRequiredClient.js';

// @Get cart by user
export const getMyCart = async (req, res, next) => {
    const userId = req.userId;
    const cartUser = await Cart.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    })
        .populate({
            path: 'items.product',
            populate: [{ path: 'variants.color' }, { path: 'variants.size' }, { path: 'category' }],
        })
        .lean();
    if (!cartUser) throw new NotFoundError('Not found cart or cart is not exist.');
    const checkStock = cartUser.items
        .filter((itemEl) => itemEl.product !== null)
        .map((item) => {
            const variant = item.product.variants.find((el) => {
                return el._id.equals(item.variant);
            });
            console.log(variant);
            if (!variant) {
                return null;
            }
            if (item.quantity > variant.stock) {
                item.quantity = variant.stock;
            }
            return {
                ...item,
                variantObj: {
                    ...variant,
                    color: variant.color.name,
                    size: variant.size.name,
                    category: item.product.category.name,
                    categoryId: item.product.category._id,
                },
            };
        })
        .filter((el) => el !== null);

    await Cart.findOneAndUpdate({ userId: new mongoose.Types.ObjectId(userId) }, { items: checkStock }, { new: true });

    const itemsResponse = checkStock
        .map((item) => {
            const newItem = {
                productId: item.product._id,
                isActive: item.product.isActive,
                variantId: item.variant,
                quantity: item.quantity,
                name: item.product.name,
                price: item.product.price,
                image: item.product.variants[0].image,
                description: item.product.description,
                discount: item.product.discount,
                ...item.variantObj,
            };
            return newItem;
        })
        .filter((el) => el.isActive);
    const myCart = {
        userId: cartUser.userId,
        items: itemsResponse,
    };

    return myCart;
};

// @Add to cart
export const addToCart = async (req, res, next) => {
    let { productId, quantity, variantId } = req.body;
    let userId = req.userId;
    // Convert ids to ObjectId format if they are strings
    productId = new mongoose.Types.ObjectId(productId);
    userId = new mongoose.Types.ObjectId(userId);
    variantId = new mongoose.Types.ObjectId(variantId);

    let updatedCart = null;

    const [product, currentCart] = await Promise.all([
        Product.findOne({ _id: productId }).lean(),
        Cart.findOne({ userId }).lean(),
    ]);

    if (!product) throw new BadRequestError(`Not found product`);
    if (quantity < 1) throw new BadRequestError(`Quantity must be at least 1`);

    const item = product.variants.find((item) => item._id.equals(variantId));
    if (!item) throw new BadRequestError(`Not found variant`);

    if (quantity > item.stock) quantity = item.stock;

    if (!currentCart) {
        const newCart = new Cart({
            userId,
            items: [{ product: productId, variant: variantId, quantity }],
        });
        await newCart.save();
        return newCart;
    }

    if (currentCart && currentCart.items.length > 0) {
        const productInThisCart = currentCart.items.find((item) => item.variant.equals(variantId));
        const currentQuantity = productInThisCart?.quantity || 0;
        const newQuantity = currentQuantity + quantity;
        if (newQuantity > item.stock) {
            throw new BadRequestError('Sản phẩm vượt quá số lượng trong kho');
        }
        updatedCart = await Cart.findOneAndUpdate(
            { userId, 'items.product': productId, 'items.variant': variantId },
            {
                $set: {
                    'items.$.quantity': newQuantity > item.stock ? item.stock : newQuantity,
                },
            },
            { new: true, upsert: false },
        );
    }

    if (!updatedCart) {
        updatedCart = await Cart.findOneAndUpdate(
            { userId },
            {
                $push: { items: { product: productId, variant: variantId, quantity } },
            },
            { new: true, upsert: true },
        );
    }

    return updatedCart;
};

// @Remove one cart item
export const removeCartItem = async (req, res, next) => {
    const userId = req.userId;
    const updatedCart = await Cart.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $pull: { items: { variant: req.params.variantId } } },
        { new: true },
    );
    if (!updatedCart) throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
    return null;
};

// @Remove all cart items
export const removeAllCartItems = async (req, res, next) => {
    const userId = req.userId;
    const cart = await Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true }).lean();

    if (!cart) throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);

    return null;
};

// @Update  cart item quantity
export const updateCartItemQuantity = async (req, res, next) => {
    const userId = req.userId;
    const product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(req.body.productId),
        'variants._id': new mongoose.Types.ObjectId(req.body.variantId),
    });
    if (!product) throw new BadRequestError(`Not found product`);

    if (req.body.quantity <= 0) {
        req.body.quantity = 1;
    }
    if (req.body.quantity > product.variants.find((el) => el._id.equals(req.body.variantId)).stock) {
        req.body.quantity = product.variants.find((el) => el._id.equals(req.body.variantId)).stock;
    }

    const updatedQuantity = await Cart.findOneAndUpdate(
        {
            userId: new mongoose.Types.ObjectId(userId),
            'items.product': new mongoose.Types.ObjectId(req.body.productId),
            'items.variant': new mongoose.Types.ObjectId(req.body.variantId),
        },
        { $set: { 'items.$.quantity': req.body.quantity } },
        { new: true },
    );
    if (!updatedQuantity)
        throw new BadRequestError(
            `Not found product with Id: ${req.body.productId} inside this cart or cart not found`,
        );

    return null;
};
