import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISentMail extends Document {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    html: string;
    sentBy: Types.ObjectId;
    sentByName: string;
    sentAt: Date;
}

const SentMailSchema = new Schema<ISentMail>(
    {
        to: { type: String, required: true },
        cc: { type: String },
        bcc: { type: String },
        subject: { type: String, required: true },
        html: { type: String, required: true },
        sentBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sentByName: { type: String, required: true },
    },
    { timestamps: true }
);

const SentMail = mongoose.model<ISentMail>('SentMail', SentMailSchema);
export default SentMail;
