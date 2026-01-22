const User = require('../models/User');
const Jeep = require('../models/Jeep');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({});

        const totalDrivers = await Jeep.countDocuments({});

        const totalHotels = await Hotel.countDocuments({});
        const totalBookings = await Booking.countDocuments({});

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newHotels = await Hotel.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedGrowth = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const monthIdx = d.getMonth() + 1;
            const year = d.getFullYear();

            const found = userGrowth.find(g => g._id.month === monthIdx && g._id.year === year);
            formattedGrowth.push({
                label: months[monthIdx - 1],
                value: found ? found.count : 0
            });
        }

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalDrivers,
                totalHotels,
                newHotels,
                totalBookings,
                userGrowth: formattedGrowth
            }
        });
    } catch (error) {
        next(error);
    }
};
