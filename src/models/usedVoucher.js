import mongoose from 'mongoose';

const usedVoucherSchema = new mongoose.Schema(
    {
        voucherCode: { type: String, ref: 'Voucher', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        usageCount: { type: Number, default: 1 },
    },
    { timestamps: false },
);

usedVoucherSchema.index({ voucherCode: 1, userId: 1 }, { unique: true });

export default mongoose.model('UsedVoucher', usedVoucherSchema);
