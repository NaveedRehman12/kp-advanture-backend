const Review = require('../models/Review');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Jeep = require('../models/Jeep');

const updateEntityStats = async (entityType, entityId) => {
    if (entityType === 'APP') return;
    const Model = entityType === 'PLACE' ? Place : (entityType === 'HOTEL' ? Hotel : Jeep);
    const reviews = await Review.find({ entityId, status: 'APPROVED' });

    if (reviews.length === 0) {
        await Model.findByIdAndUpdate(entityId, { avgRating: 0, reviewCount: 0 });
        return;
    }

    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    await Model.findByIdAndUpdate(entityId, { avgRating, reviewCount: reviews.length });
};

exports.createReview = async (req, res, next) => {
    try {
        const { entityType, entityId, rating, comment } = req.body;
        const review = await Review.create({
            entityType,
            entityId,
            userId: req.user._id,
            rating,
            comment,
            status: 'APPROVED'
        });


        await updateEntityStats(entityType, entityId);

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

exports.getReviews = async (req, res, next) => {
    try {
        const { entityType, entityId, status } = req.query;
        let query = {};
        if (entityType) query.entityType = entityType;
        if (entityId) query.entityId = entityId;

        if (status) query.status = status;
        else query.status = 'APPROVED';

        const reviews = await Review.find(query).populate('userId', 'name').sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        next(error);
    }
};

exports.getAdminReviews = async (req, res, next) => {
    try {
        const { status, entityType } = req.query;
        let query = {};
        if (status) query.status = status;
        if (entityType) query.entityType = entityType;

        const reviews = await Review.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        next(error);
    }
};

exports.updateReviewStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

        review.status = status;
        await review.save();


        await updateEntityStats(review.entityType, review.entityId);

        res.json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            const { entityType, entityId } = review;
            await Review.findByIdAndDelete(req.params.id);

            await updateEntityStats(entityType, entityId);
        }
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        next(error);
    }
};
