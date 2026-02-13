'use server';

import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

/**
 * ====================
 * REVIEW SERVER ACTIONS
 * ====================
 * Production-ready review system with purchase verification
 */

/**
 * Submit a product review
 * Only customers who purchased the product can review
 */
export async function submitReview(productId: string, rating: number, comment: string) {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'customer') {
            return { success: false, error: 'Must be logged in as customer to review' };
        }

        // Validate inputs
        if (!productId || productId.length !== 24) {
            return { success: false, error: 'Invalid product ID' };
        }

        if (!rating || rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' };
        }

        if (!comment || comment.trim().length < 10) {
            return { success: false, error: 'Comment must be at least 10 characters' };
        }

        if (comment.length > 500) {
            return { success: false, error: 'Comment must be less than 500 characters' };
        }

        await connectDB();

        // Verify customer purchased this product
        const order = await Order.findOne({
            customerId: session.user.userId,
            'items.productId': productId,
            status: 'delivered', // Only delivered orders
        }).lean();

        if (!order) {
            return {
                success: false,
                error: 'You must purchase this product before reviewing',
            };
        }

        // Check for existing review
        const existingReview = await Review.findOne({
            productId,
            customerId: session.user.userId,
        });

        if (existingReview) {
            return {
                success: false,
                error: 'You have already reviewed this product',
            };
        }

        // Create review
        const review = await Review.create({
            productId,
            customerId: session.user.userId,
            orderId: order._id,
            rating,
            comment: comment.trim(),
        });

        console.log(`[Review] Customer ${session.user.userId} reviewed product ${productId}`);

        return {
            success: true,
            message: 'Review submitted successfully',
            review: {
                id: review._id.toString(),
                rating,
                comment: review.comment,
                createdAt: review.createdAt.toISOString(),
            },
        };

    } catch (error: any) {
        console.error('[Review] Error in submitReview:', error);

        // Handle unique constraint violation
        if (error.code === 11000) {
            return {
                success: false,
                error: 'You have already reviewed this product',
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to submit review',
        };
    }
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string) {
    try {
        if (!productId || productId.length !== 24) {
            return { success: false, error: 'Invalid product ID', reviews: [] };
        }

        await connectDB();

        const reviews = await Review.find({ productId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('customerId', 'name')
            .lean()
            .catch(() => []);

        const formattedReviews = reviews.map(r => ({
            id: r._id.toString(),
            rating: r.rating || 0,
            comment: r.comment || '',
            customerName: (r.customerId as any)?.name || 'Anonymous',
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
        }));

        return {
            success: true,
            reviews: formattedReviews,
            count: formattedReviews.length,
        };

    } catch (error: any) {
        console.error('[Review] Error in getProductReviews:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch reviews',
            reviews: [],
        };
    }
}

/**
 * Get average rating for a product
 */
export async function getAverageRating(productId: string) {
    try {
        if (!productId || productId.length !== 24) {
            return { success: false, average: 0, count: 0 };
        }

        await connectDB();

        const result = await Review.aggregate([
            { $match: { productId: new (require('mongoose').Types.ObjectId)(productId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]).catch(() => []);

        if (!result || result.length === 0) {
            return { success: true, average: 0, count: 0 };
        }

        return {
            success: true,
            average: Math.round((result[0].averageRating || 0) * 10) / 10, // Round to 1 decimal
            count: result[0].totalReviews || 0,
        };

    } catch (error: any) {
        console.error('[Review] Error in getAverageRating:', error);
        return {
            success: false,
            error: error.message || 'Failed to calculate average',
            average: 0,
            count: 0,
        };
    }
}

/**
 * Check if customer can review a product
 */
export async function canReviewProduct(productId: string) {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'customer') {
            return { success: true, canReview: false, reason: 'Must be logged in' };
        }

        if (!productId || productId.length !== 24) {
            return { success: true, canReview: false, reason: 'Invalid product' };
        }

        await connectDB();

        // Check if already reviewed
        const existingReview = await Review.findOne({
            productId,
            customerId: session.user.userId,
        });

        if (existingReview) {
            return { success: true, canReview: false, reason: 'Already reviewed' };
        }

        // Check if purchased
        const order = await Order.findOne({
            customerId: session.user.userId,
            'items.productId': productId,
            status: 'delivered',
        });

        if (!order) {
            return { success: true, canReview: false, reason: 'Must purchase first' };
        }

        return { success: true, canReview: true, reason: null };

    } catch (error: any) {
        console.error('[Review] Error in canReviewProduct:', error);
        return {
            success: false,
            canReview: false,
            reason: 'Error checking eligibility',
        };
    }
}
