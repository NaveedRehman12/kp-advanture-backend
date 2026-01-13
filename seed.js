require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Place = require('./src/models/Place');
const Hotel = require('./src/models/Hotel');
const Jeep = require('./src/models/Jeep');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for seeding');

        // Clear existing
        await User.deleteMany();
        await Place.deleteMany();
        await Hotel.deleteMany();
        await Jeep.deleteMany();

        // Create Super Admin
        await User.create({
            name: 'Super Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'SUPER_ADMIN'
        });

        // Create Managers
        await User.create({
            name: 'Hotel Manager',
            email: 'hotel@test.com',
            password: 'password123',
            role: 'HOTEL_MANAGER'
        });

        // Create Sample Places
        await Place.create([
            {
                name: 'Beautiful Beach',
                description: 'A serene beach with golden sands.',
                images: [],
                gps: { lat: 40.7128, lng: -74.0060 },
                locationText: 'Coastal City',
                category: 'Nature'
            },
            {
                name: 'Mountain Peak',
                description: 'Breathtaking views from the highest point.',
                images: [],
                gps: { lat: 41.7128, lng: -75.0060 },
                locationText: 'Alpine Village',
                category: 'Adventure'
            }
        ]);

        console.log('Seeding completed');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
