import mongoose, { Schema } from 'mongoose';

const colorSchema = new Schema(
    {
        hex: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export default mongoose.model('Color', colorSchema);
