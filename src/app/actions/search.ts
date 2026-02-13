'use server';

import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Shop from '@/models/Shop';

/**
 * ====================
 * SEARCH SERVER ACTIONS
 * ====================
 * Production-ready search with text indexing and filters
 */

// Search filters type
type SearchFilters = {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    availableOnly?: boolean;
};

/**
 * Search products with filters
 * Uses MongoDB text index for fast searching
 */
export async function searchProducts(query: string = '', filters: SearchFilters = {}) {
    try {
        await connectDB();

        // Build search query
        const searchQuery: any = {};

        // Text search if query provided
        if (query && query.trim()) {
            searchQuery.$or = [
                { name: { $regex: query.trim(), $options: 'i' } },
                { description: { $regex: query.trim(), $options: 'i' } }
            ];
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
            searchQuery.category = filters.category;
        }

        // Price range filter
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            searchQuery.price = {};
            if (filters.minPrice !== undefined) {
                searchQuery.price.$gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                searchQuery.price.$lte = filters.maxPrice;
            }
        }

        // Availability filter
        if (filters.availableOnly) {
            searchQuery.isAvailable = true;
        }

        // Execute search with limits
        const products = await Product.find(searchQuery)
            .limit(50) // Limit results for performance
            .lean()
            .catch(err => {
                console.error('[Search] Product search error:', err);
                return [];
            });

        if (!products || products.length === 0) {
            return { success: true, products: [], count: 0 };
        }

        // Get shop details for each product
        const shopIds = [...new Set(products.map(p => p.shopId?.toString()).filter(Boolean))];
        const shops = await Shop.find({ _id: { $in: shopIds } })
            .select('_id name isActive')
            .lean()
            .catch(() => []);

        const shopMap = new Map(shops.map(s => [s._id.toString(), s]));

        // Format results
        const results = products
            .filter(p => {
                // Only show products from active shops
                const shop = shopMap.get(p.shopId?.toString() || '');
                return shop && shop.isActive;
            })
            .map(p => {
                const shop = shopMap.get(p.shopId?.toString() || '');
                return {
                    id: p._id.toString(),
                    name: p.name || 'Unnamed Product',
                    description: p.description || '',
                    price: p.price || 0,
                    category: p.category || 'Other',
                    image: p.image || '',
                    isAvailable: p.isAvailable ?? false,
                    shopId: p.shopId?.toString() || '',
                    shopName: shop?.name || 'Unknown Shop',
                };
            });

        return {
            success: true,
            products: results,
            count: results.length,
        };

    } catch (error: any) {
        console.error('[Search] Fatal error in searchProducts:', error);
        return {
            success: false,
            error: error.message || 'Search failed',
            products: [],
            count: 0,
        };
    }
}

/**
 * Get unique categories for filter dropdown
 */
export async function getCategories() {
    try {
        await connectDB();

        const categories = await Product.distinct('category').catch(() => []);

        // Filter out empty/null values
        const validCategories = categories
            .filter(c => c && typeof c === 'string')
            .sort();

        return {
            success: true,
            categories: ['all', ...validCategories],
        };

    } catch (error: any) {
        console.error('[Search] Error in getCategories:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch categories',
            categories: ['all'],
        };
    }
}

/**
 * Get price range for filter
 */
export async function getPriceRange() {
    try {
        await connectDB();

        const result = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]).catch(() => []);

        if (!result || result.length === 0) {
            return {
                success: true,
                minPrice: 0,
                maxPrice: 1000,
            };
        }

        return {
            success: true,
            minPrice: Math.floor(result[0].minPrice || 0),
            maxPrice: Math.ceil(result[0].maxPrice || 1000),
        };

    } catch (error: any) {
        console.error('[Search] Error in getPriceRange:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch price range',
            minPrice: 0,
            maxPrice: 1000,
        };
    }
}

/**
 * Search shops/vendors
 */
export async function searchShops(query: string = '') {
    try {
        await connectDB();

        const searchQuery: any = { isActive: true };

        if (query && query.trim()) {
            searchQuery.$or = [
                { name: { $regex: query.trim(), $options: 'i' } },
                { description: { $regex: query.trim(), $options: 'i' } }
            ];
        }

        const shops = await Shop.find(searchQuery)
            .limit(20)
            .lean()
            .catch(() => []);

        const results = shops.map(s => ({
            id: s._id.toString(),
            name: s.name || 'Unnamed Shop',
            description: s.description || '',
            cuisineType: s.cuisineType || [],
            image: s.image || '',
        }));

        return {
            success: true,
            shops: results,
            count: results.length,
        };

    } catch (error: any) {
        console.error('[Search] Error in searchShops:', error);
        return {
            success: false,
            error: error.message || 'Search failed',
            shops: [],
            count: 0,
        };
    }
}
