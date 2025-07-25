import { BadRequestError, NotFoundError } from '../errors/customError.js';
import Product from '../models/product.js';

const updateStock = async (dataItems, decreaseStock, session = null) => {
    return Promise.all(
        dataItems.map(async (item) => {
            const productTarget = session
                ? await Product.findOne({ _id: item.productId }).session(session)
                : await Product.findOne({ _id: item.productId });

            if (!productTarget) {
                throw new NotFoundError('Product not found');
            }

            productTarget.variants = productTarget.variants.map((variant) => {
                if (variant._id.toString() === item.variantId.toString()) {
                    if (decreaseStock) {
                        const newStock = variant.stock - item.quantity;
                        if (newStock < 0) {
                            throw new BadRequestError('Sản phẩm đã hết hàng!');
                        }
                        variant.stock = newStock;
                    } else {
                        variant.stock += item.quantity;
                    }
                }
                return variant;
            });

            productTarget.sold += decreaseStock ? item.quantity : -item.quantity;
            return productTarget.save();
        }),
    );
};

export const updateStockOnCreateOrder = async (dataItems, session) => {
    return updateStock(dataItems, true, session);
};

export const updateStockOnCancelOrder = async (dataItems) => {
    return updateStock(dataItems, false);
};
