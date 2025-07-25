import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { PAYMENT_METHOD } from '../constants/paymentMethod.js';
import { ROLE } from '../constants/role.js';

const OrderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        variantId: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
        },
        size: { type: String, required: true },
        color: { type: String, required: true },
        category: { type: String, required: true },
        tags: [{ type: String, required: true }],
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        isReviewed: {
            type: Boolean,
            default: false,
        },
        isReviewDisabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
        id: false,
        versionKey: false,
        timestamps: false,
    },
);

const orderSchema = new mongoose.Schema(
    {
         voucherDiscount: {
            type: Number,
            default: 0,
        },
        discountType: {
            type: String,
            required: true,
            default: null,
        },
        voucherName: {
            type: String,
            default: null,
        },
        voucherCode: {
            type: String,
            default: null,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        items: [OrderItemSchema],
        totalPrice: {
            type: Number,
            required: true,
        },
        shippingFee: {
            type: Number,
            default: 0,
        },
        customerInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        receiverInfo: {
            name: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
        },
        shippingAddress: {
            country: {
                type: String,
                default: 'Viet Nam',
            },
            ward:String,
            province: String,
            district: String,
            address: String,
        },
        paymentMethod: {
            type: String,
            trim: true,
            required: true,
            enum: Object.values(PAYMENT_METHOD),
            default: PAYMENT_METHOD.CARD,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        canceledBy: {
            type: String,
            default: 'none',
            enum: [...Object.values(ROLE), 'none'],
        },
        description: {
            type: String,
        },
        orderStatus: {
            type: String,
            default: ORDER_STATUS.PENDING,
            enum: Object.values(ORDER_STATUS),
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
export default mongoose.model('Order', orderSchema);
