import { sizes } from './sizes.js';
import { colors } from './colors.js';
import { products } from './products.js';
import { categories } from './categories.js';
import { tags } from './tags.js';
import { order } from './orders.js';
import Product from '../models/product.js';
import Category from '../models/category.js';
import Tag from '../models/tag.js';
import Size from '../models/size.js';
import Color from '../models/color.js';
import User from '../models/user.js';
import Order from '../models/order.js';
import Cart from '../models/cart.js';
import { getRandomIntegerBelow } from '../utils/getRandomIntegerBelow.js';
import { envConfig } from '../config/env.js';
import { generateToken } from '../services/token.service.js';
import { ROLE } from '../constants/role.js';
export const handleInsertData = async (req, res) => {
    try {
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Tag.deleteMany({});
        await Size.deleteMany({});
        await Color.deleteMany({});
        await User.deleteMany({});
        await Cart.deleteMany({});

        const user = await User.create({
            email: 'admin@gmail.com',
            name: 'Admin',
            isActive: true,
            password: 'admin123',
            phone: '0976878654',
            role: ROLE.ADMIN,
        });
        await User.create({
            email: 'test@gmail.com',
            name: 'Admin',
            isActive: true,
            password: '88888888',
            phone: '0976878654',
            role: ROLE.USER,
        });
        const createdSizes = await Size.insertMany(sizes);
        const createdColors = await Color.insertMany(colors);
        const createdCategories = await Category.insertMany(categories);
        const createdTags = await Tag.insertMany(tags);
        if (!createdSizes.length || !createdColors.length || !createdCategories.length || !createdTags.length) {
            throw new Error('One or more essential collections are empty after insertion.');
        }

        const mapSizeAndColor = [];
        const productsWithIds = products.map((product) => {
            const variantsWithIds = product.variants.map((variant) => {
                let size = createdSizes[getRandomIntegerBelow(createdSizes.length)];
                let color = createdColors[getRandomIntegerBelow(createdColors.length)];
                let key = `${size._id}-${color._id}`;
                if (!mapSizeAndColor.includes(key)) {
                    mapSizeAndColor.push(key);
                } else {
                    while (mapSizeAndColor.includes(key)) {
                        size = createdSizes[getRandomIntegerBelow(createdSizes.length)];
                        color = createdColors[getRandomIntegerBelow(createdColors.length)];
                        key = `${size._id}-${color._id}`;
                    }
                }
                return {
                    ...variant,
                    size: size._id,
                    color: color._id,
                };
            });

            const category = createdCategories[getRandomIntegerBelow(createdCategories.length)];
            const sliceTag = getRandomIntegerBelow(createdTags.length);
            const tags = createdTags.slice(0, sliceTag === 0 ? 1 : sliceTag).map((tag) => tag._id);

            return {
                ...product,
                category: category._id,
                tags,
                variants: variantsWithIds,
                discount: getRandomIntegerBelow(50),
                price: 525000,
            };
        });

        const pros = await Product.insertMany(productsWithIds);
        const ordersInsert = pros.map((pro) => {
            return {
                ...order,
                userId: user._id,
                items: pro.variants.map((variant) => {
                    return {
                        productId: pro._id,
                        variantId: variant._id,
                        name: pro.name,
                        size: 'M',
                        color: 'Red',
                        category: 'Apparel',
                        tags: ['casual', 'summer'],
                        quantity: 2,
                        price: 15.99,
                        image: variant.image,
                    };
                }),
            };
        });
        await Order.insertMany(ordersInsert);
        const payload = {
            userId: user._id,
            role: user.role,
        };
        const accessToken = generateToken(payload, envConfig.JWT_SECRET, '1d');
        console.log('Data inserted successfully');
        res.json({ message: 'Xong! Quá dễ', accessToken });
    } catch (error) {
        console.error('Error inserting data: ', error.message);
    }
};
