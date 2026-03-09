import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User';
import { ENV } from '../config/env';

const seed = async () => {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGO_URI);

    const users = [
        {
            name: 'ACE Admin',
            email: 'admin@ace.com',
            password: 'Admin@123',
            role: 'admin' as const,
        },
        {
            name: 'Test User',
            email: 'user@ace.com',
            password: 'TestUser',
            role: 'user' as const,
        },
    ];

    for (const u of users) {
        const existing = await User.findOne({ email: u.email });
        if (existing) {
            console.log(`⚠️  ${u.email} already exists. Skipping.`);
            continue;
        }

        await User.create({ ...u, active: true });
        console.log(`✅ Created ${u.role}: ${u.email} / ${u.password}`);
    }

    console.log('\n🎉 Seed complete!');
    await mongoose.disconnect();
};

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
