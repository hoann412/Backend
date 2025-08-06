import mongoose, { Schema } from 'mongoose';

const TokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['access', 'refresh', 'verify'],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Token', TokenSchema);
