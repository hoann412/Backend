import mongoose, { Schema } from 'mongoose';

const voucherSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        maxUsage: {
            type: Number,
            required: true,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
            default: 'percentage',
        },
        voucherDiscount: {
            type: Number,
            required: true,
        },
        maxDiscountAmount: {
            type: Number,
            default: 0,
            description: 'Maximum discount amount applicable',
        },
        status: {
            type: Boolean,
            default: true,
        },
        minimumOrderPrice: {
            required: true,
            type: Number,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            required: true,
            type: Date,
        },
        usagePerUser: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

voucherSchema.index({ code: 1 });

export default mongoose.model('Voucher', voucherSchema);
