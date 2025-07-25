import moment from 'moment-timezone';
import Order from '../models/order.js';
import User from '../models/user.js';
import Product from '../models/product.js';

export const totalStats = async (req, res, next) => {
    const { dateFilter, startDate, endDate, month, year } = req.query;

    const vietnamTZ = 'Asia/Ho_Chi_Minh';
    let start, end;

    if (dateFilter === 'range' && startDate && endDate) {
        start = moment.tz(startDate, 'DD-MM-YYYY', vietnamTZ).startOf('day').toDate();
        end = moment.tz(endDate, 'DD-MM-YYYY', vietnamTZ).endOf('day').toDate();
    } else if (month && year) {
        start = moment.tz(`01-${month}-${year}`, 'DD-MM-YYYY', vietnamTZ).startOf('month').toDate();
        end = moment.tz(`01-${month}-${year}`, 'DD-MM-YYYY', vietnamTZ).endOf('month').toDate();
    } else if (year) {
        start = moment.tz(`01-01-${year}`, 'DD-MM-YYYY', vietnamTZ).startOf('year').toDate();
        end = moment.tz(`31-12-${year}`, 'DD-MM-YYYY', vietnamTZ).endOf('year').toDate();
    } else if (dateFilter === 'single' && startDate) {
        start = moment.tz(startDate, 'DD-MM-YYYY', vietnamTZ).startOf('day').toDate();
        end = moment.tz(startDate, 'DD-MM-YYYY', vietnamTZ).endOf('day').toDate();
    } else {
        return res.status(400).json({ message: 'Invalid date filter' });
    }

    const [totalOrders, cancelledOrders, totalRevenue, newUsers, newProducts] = await Promise.all([
        Order.countDocuments({
            createdAt: {
                $gte: start,
                $lte: end,
            },
        }),
        Order.countDocuments({
            createdAt: {
                $gte: start,
                $lte: end,
            },
            orderStatus: 'cancelled',
        }),
        Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end,
                    },
                    orderStatus: 'done',
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' },
                    count: { $sum: 1 },
                },
            },
        ]).then((result) => ({
            total: result[0]?.total || 0,
            count: result[0]?.count || 0,
        })),
        User.countDocuments({
            createdAt: {
                $gte: start,
                $lte: end,
            },
        }),
        Product.countDocuments({
            createdAt: {
                $gte: start,
                $lte: end,
            },
        }),
    ]);

    const successfulOrders = totalRevenue.count;

    const orderSuccessRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;
    const orderCancelRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    const daysDiff = moment(end).diff(moment(start), 'days') + 1;
    const averageDailyRevenue = totalRevenue.total / daysDiff;

    return {
        data: {
            totalOrders,
            cancelledOrders,
            successfulOrders,
            totalRevenue: totalRevenue.total,
            orderSuccessRate: parseFloat(orderSuccessRate.toFixed(2)),
            orderCancelRate: parseFloat(orderCancelRate.toFixed(2)),
            newUsers,
            newProducts,
            averageDailyRevenue: parseFloat(averageDailyRevenue.toFixed(2)),
            dateRange: {
                start: moment(start).format('YYYY-MM-DD'),
                end: moment(end).format('YYYY-MM-DD'),
            },
        },
    };
};
export const orderByDayStats = async (req, res, next) => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    if (req.query.year) {
        year = parseInt(req.query.year);
    }

    if (req.query.month) {
        month = parseInt(req.query.month);
    }

    const vietnamTZ = 'Asia/Ho_Chi_Minh';

    const startDate = moment.tz(`01-${month}-${year}`, 'DD-MM-YYYY', vietnamTZ).startOf('month').utc().toDate();
    const endDate = moment.tz(`01-${month}-${year}`, 'DD-MM-YYYY', vietnamTZ).endOf('month').utc().toDate();

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $addFields: {
                createdAtVN: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M:%S',
                        date: '$createdAt',
                        timezone: '+07:00',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: { $toDate: '$createdAtVN' } },
                    month: { $month: { $toDate: '$createdAtVN' } },
                    year: { $year: { $toDate: '$createdAtVN' } },
                },
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalPrice' },
            },
        },
        {
            $project: {
                _id: 0,
                date: {
                    $dateFromParts: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: '$_id.day',
                    },
                },
                totalOrders: 1,
                totalRevenue: 1,
            },
        },
        {
            $sort: { date: 1 },
        },
    ]);

    const stats = data.map((stat) => ({
        date: moment(stat.date).format('MMM DD'),
        totalOrders: stat.totalOrders,
        totalRevenue: stat.totalRevenue,
    }));

    return stats;
};
export const orderByMonthStats = async (req, res, next) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ message: 'Year is required' });
    }

    const vietnamTZ = 'Asia/Ho_Chi_Minh';

    const startDate = moment.tz(`01-01-${year}`, 'DD-MM-YYYY', vietnamTZ).startOf('year');
    const endDate = moment.tz(`31-12-${year}`, 'DD-MM-YYYY', vietnamTZ).endOf('year');

    const pipeline = [
        {
            $match: {
                createdAt: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                },
                orderStatus: 'done',
                isPaid: true,
            },
        },
        {
            $addFields: {
                createdAtVN: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M:%S',
                        date: '$createdAt',
                        timezone: '+07:00',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: { $toDate: '$createdAtVN' } },
                    year: { $year: { $toDate: '$createdAtVN' } },
                },
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalPrice' },
            },
        },
        {
            $project: {
                _id: 0,
                month: {
                    $arrayElemAt: [
                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        { $subtract: ['$_id.month', 1] },
                    ],
                },
                year: '$_id.year',
                totalOrders: 1,
                totalRevenue: 1,
            },
        },

        {
            $sort: { '_id.month': 1 },
        },
    ];

    const data = await Order.aggregate(pipeline);

    const fullYearData = Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        year: parseInt(year),
        totalOrders: 0,
        totalRevenue: 0,
    }));

    data.forEach((item) => {
        const index = fullYearData.findIndex((d) => d.month === item.month);
        if (index !== -1) {
            fullYearData[index] = {
                ...item,
                totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
            };
        }
    });

    return fullYearData;
};
export const orderByYearStats = async (req, res, next) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ message: 'Year is required' });
    }

    const vietnamTZ = 'Asia/Ho_Chi_Minh';

    const startDate = moment.tz(`01-01-${year}`, 'DD-MM-YYYY', vietnamTZ).startOf('year');
    const endDate = moment.tz(`31-12-${year}`, 'DD-MM-YYYY', vietnamTZ).endOf('year');

    const start = startDate.utc().toDate();
    const end = endDate.utc().toDate();

    const pipeline = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                orderStatus: { $ne: 'cancelled' },
                isPaid: true,
            },
        },
        {
            $addFields: {
                createdAtVN: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M:%S',
                        date: '$createdAt',
                        timezone: '+07:00',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: { $toDate: '$createdAtVN' } },
                },
                totalOrders: { $sum: 1 },
                totalRevenue: {
                    $sum: {
                        $cond: [{ $eq: ['$orderStatus', 'done'] }, '$totalPrice', 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                month: '$_id.month',
                totalOrders: 1,
                totalRevenue: 1,
            },
        },
        {
            $sort: { month: 1 },
        },
    ];

    const data = await Order.aggregate(pipeline);

    const totalOrders = data.reduce((acc, curr) => acc + curr.totalOrders, 0);
    const totalRevenue = data.reduce((acc, curr) => acc + curr.totalRevenue, 0);

    return {
        data: {
            year: parseInt(year),
            months: data,
            totalOrders,
            totalRevenue,
        },
    };
};
export const orderByDateRangeStats = async (req, res, next) => {
    const { startDate, endDate } = req.query;
    let start, end;

    if (startDate && endDate) {
        start = moment.tz(startDate, 'DD-MM-YYYY', 'Asia/Ho_Chi_Minh').startOf('day').utc().toDate();
        end = moment.tz(endDate, 'DD-MM-YYYY', 'Asia/Ho_Chi_Minh').endOf('day').utc().toDate();
    } else {
        return res.status(400).json({ message: 'Invalid date range' });
    }

    const pipeline = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                orderStatus: { $ne: 'cancelled' },
                isPaid: true,
            },
        },
        {
            $addFields: {
                createdAtVN: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M:%S',
                        date: '$createdAt',
                        timezone: '+07:00',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$createdAt',
                        timezone: '+07:00',
                    },
                },
                totalOrders: { $sum: 1 },
                totalRevenue: {
                    $sum: {
                        $cond: [{ $eq: ['$orderStatus', 'done'] }, '$totalPrice', 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                totalOrders: 1,
                totalRevenue: 1,
            },
        },
        { $sort: { date: 1 } },
    ];

    const data = await Order.aggregate(pipeline);

    const allDates = [];
    const currentDate = moment(start).tz('Asia/Ho_Chi_Minh');
    const lastDate = moment(end).tz('Asia/Ho_Chi_Minh');

    while (currentDate <= lastDate) {
        const dateString = currentDate.format('DD-MM-YYYY');
        const existingStat = data.find((s) => s.date === currentDate.format('YYYY-MM-DD')) || {
            totalOrders: 0,
            totalRevenue: 0,
        };

        allDates.push({
            date: dateString,
            totalOrders: existingStat.totalOrders,
            totalRevenue: parseFloat(existingStat.totalRevenue.toFixed(2)),
        });

        currentDate.add(1, 'days');
    }

    return allDates;
};
export const getProductStats = async (req, res, next) => {
    const { startDate, endDate } = req.query;
    let start, end;

    if (startDate && endDate) {
        start = moment.tz(startDate, 'DD-MM-YYYY', 'Asia/Ho_Chi_Minh').startOf('day').utc().toDate();
        end = moment.tz(endDate, 'DD-MM-YYYY', 'Asia/Ho_Chi_Minh').endOf('day').utc().toDate();
    } else {
        return res.status(400).json({ message: 'Invalid date range' });
    }

    const pipeline = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                orderStatus: 'done',
                isPaid: true,
            },
        },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.productId',
                name: { $first: '$items.name' },
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: {
                    $sum: { $multiply: ['$items.quantity', '$items.price'] },
                },
                image: { $first: '$items.image' },
                price: { $first: '$items.price' },
            },
        },
        { $sort: { totalQuantity: -1 } },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        {
            $addFields: {
                variants: { $first: '$productDetails.variants' },
            },
        },
    ];

    const allProductStats = await Order.aggregate(pipeline);

    const topSellingProducts = allProductStats.slice(0, 5);
    const leastSellingProducts = allProductStats.slice(-5).reverse();

    const totalStock = await Product.aggregate([
        {
            $unwind: '$variants',
        },
        {
            $group: {
                _id: null,
                totalStock: { $sum: '$variants.stock' },
            },
        },
    ]);

    const totalStockValue = totalStock[0]?.totalStock || 0;

    const addPercentage = async (products) => {
        return Promise.all(
            products.map(async (product) => {
                const productData = await Product.findById(product._id);
                const productTotalStock =
                    productData?.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0) || 0;

                return {
                    _id: product._id,
                    name: product.name,
                    totalQuantity: product.totalQuantity,
                    totalRevenue: parseFloat(product.totalRevenue.toFixed(2)),
                    image: product.image,
                    price: product.price,
                    percentageOfTotal: (
                        (product.totalQuantity / (product.totalQuantity + productTotalStock)) *
                        100
                    ).toFixed(2),
                    percentageOfAllProducts: ((productTotalStock / totalStockValue) * 100).toFixed(2),
                };
            }),
        );
    };

    const topSellingWithPercentage = await addPercentage(topSellingProducts);
    const leastSellingWithPercentage = await addPercentage(leastSellingProducts);

    return {
        data: {
            topSellingProducts: topSellingWithPercentage,
            leastSellingProducts: leastSellingWithPercentage,
            dateRange: {
                start: moment(start).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY'),
                end: moment(end).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY'),
            },
        },
    };
};
export const findTop5Buyers = async (req, res, next) => {
    const { dateFilter, startDate, endDate, month, year } = req.query;

    const vietnamTZ = 'Asia/Ho_Chi_Minh';
    let start, end;

    if (dateFilter === 'range' && startDate && endDate) {
        start = moment.tz(startDate, 'DD-MM-YYYY', vietnamTZ).startOf('day').utc().toDate();
        end = moment.tz(endDate, 'DD-MM-YYYY', vietnamTZ).endOf('day').utc().toDate();
    } else if (month && year) {
        start = moment.tz(`01-${month}-${year}`, 'DD-MM-YYYY', vietnamTZ).startOf('month').utc().toDate();
        end = moment.tz(`01-${month}-${year}`, 'DD-MM-YYYY', vietnamTZ).endOf('month').utc().toDate();
    } else if (year) {
        start = moment.tz(`01-01-${year}`, 'DD-MM-YYYY', vietnamTZ).startOf('year').utc().toDate();
        end = moment.tz(`31-12-${year}`, 'DD-MM-YYYY', vietnamTZ).endOf('year').utc().toDate();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid date filter' });
    }

    const topBuyersPipeline = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                orderStatus: 'done',
                isPaid: true,
            },
        },
        {
            $addFields: {
                createdAtVN: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M:%S',
                        date: '$createdAt',
                        timezone: '+07:00',
                    },
                },
            },
        },
        {
            $group: {
                _id: '$userId',
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: '$totalPrice' },
                totalItems: { $sum: { $sum: '$items.quantity' } },
                lastOrderDate: { $max: '$createdAtVN' },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo',
            },
        },
        {
            $unwind: '$userInfo',
        },
        {
            $project: {
                _id: 1,
                totalOrders: 1,
                totalSpent: 1,
                totalItems: 1,
                lastOrderDate: 1,
                name: '$userInfo.name',
                email: '$userInfo.email',
                phone: '$userInfo.phone',
                avatar: '$userInfo.avatar',
            },
        },
        {
            $sort: { totalSpent: -1 },
        },
        {
            $limit: 5,
        },
    ];

    const latestOrdersPipeline = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
            },
        },
        {
            $addFields: {
                createdAtVN: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M:%S',
                        date: '$createdAt',
                        timezone: '+07:00',
                    },
                },
            },
        },
        {
            $sort: { createdAtVN: -1 },
        },
        {
            $limit: 2,
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo',
            },
        },
        {
            $unwind: '$userInfo',
        },
        {
            $project: {
                _id: 1,
                customerName: '$userInfo.name',
                customerAvatar: '$userInfo.avatar',
                paymentMethod: 1,
                totalPrice: 1,
                orderStatus: 1,
                createdAt: '$createdAtVN',
            },
        },
    ];

    const [topBuyers, latestOrders] = await Promise.all([
        Order.aggregate(topBuyersPipeline),
        Order.aggregate(latestOrdersPipeline),
    ]);

    return {
        topBuyers,
        latestOrders,
        dateRange: {
            start: moment(start).tz(vietnamTZ).format('DD-MM-YYYY'),
            end: moment(end).tz(vietnamTZ).format('DD-MM-YYYY'),
        },
    };
};
