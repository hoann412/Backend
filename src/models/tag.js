import mongoose, { Schema } from 'mongoose';

const tagSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export default mongoose.model('Tag', tagSchema);
