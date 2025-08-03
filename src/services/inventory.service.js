import { BadRequestError, NotFoundError } from '../errors/customError.js';
import Product from '../models/product.js';

const updateStock = async (dataItems, decreaseStock, session = null) => {
    return Promise.all(
        dataItems.map(async (item) => {
            const product = session
                ? await Product.findOne({ _id: item.productId }).session(session)
                : await Product.findOne({ _id: item.productId });

            if (!product) {
                throw new NotFoundError(`Sản phẩm không tồn tại (ID: ${item.productId})`);
            }

            const variantIndex = product.variants.findIndex(v => v._id.toString() === item.variantId.toString());

            if (variantIndex === -1) {
                throw new NotFoundError(`Biến thể không tồn tại trong sản phẩm ${product.name}`);
            }

            const variant = product.variants[variantIndex];

            if (decreaseStock) {
                const newStock = variant.stock - item.quantity;
                if (newStock < 0) {
                    throw new BadRequestError(`Sản phẩm "${product.name}" đã hết hàng. Hiện chỉ còn: ${variant.stock}`);
                }
                variant.stock = newStock;
            } else {
                variant.stock += item.quantity;
            }

            product.variants[variantIndex] = variant;

            // Cập nhật số lượng bán
            product.sold += decreaseStock ? item.quantity : -item.quantity;

            return product.save({ session });
        })
    );
};

export const updateStockOnCreateOrder = async (dataItems, session) => {
    return updateStock(dataItems, true, session);
};

export const updateStockOnCancelOrder = async (dataItems, session = null) => {
    return updateStock(dataItems, false, session);
};
