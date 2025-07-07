import mongoose, { Schema } from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                type: {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product',
                        required: true,
                    },
                    variant: mongoose.Schema.Types.ObjectId,
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                    _id: false,
                },
                default: [],
            },
        ],
    },
    { timestamps: true, versionKey: false },
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
