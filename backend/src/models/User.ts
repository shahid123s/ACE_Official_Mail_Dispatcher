import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    active: boolean;
    mustChangePassword: boolean;
    createdAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        active: { type: Boolean, default: true },
        mustChangePassword: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transform: (_doc: any, ret: any) => {
                delete ret.password;
                return ret;
            },
        },
    }
);

// Hash password before save
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).password = await bcrypt.hash((this as any).password, salt);
});

// Compare method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password as string);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
