import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { BadRequestError, NotAcceptableError, NotFoundError } from '../errors/customError.js';
import Order from '../models/order.js';
import APIQuery from '../utils/APIQuery.js';
import { sendMail } from '../utils/sendMail.js';
import customResponse from '../helpers/response.js';
import { inventoryService } from './index.js';
import { ORDER_STATUS, PAYMENT_METHOD } from '../constants/orderStatus.js';
import { ROLE } from '../constants/role.js';
import mongoose, { set } from 'mongoose';
import Cart from '../models/cart.js';
import { checkVoucherIsValid, rollbackVoucher } from './voucherChecking.service.js';
import User from '../models/user.js';

// @GET:  Get all orders
export const getAllOrders = async (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);
    const searchString = req.query.rawsearch;
    const searchQuery = searchString ? { 'customerInfo.name': { $regex: searchString, $options: 'i' } } : {};
    const features = new APIQuery(Order.find(searchQuery), req.query);
    features.filter().sort().limitFields().search().paginate();

    const [orders, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders,
                page,
                totalDocs,
                totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

//@GET: Get all orders by user
export const getAllOrdersByUser = async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = Number(req.query.limit || 10);
    req.query.userId;

    const features = new APIQuery(Order.find({ userId }), req.query);
    features.filter().sort().limitFields().search().paginate();

    const [orders, totalDocs] = await Promise.all([features.query, features.count()]);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders,
                page,
                totalDocs,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

//@GET: Get the detailed order
export const getDetailedOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.params.id}`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: order,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @POST: Create new order
export const createOrder = async (req, res, next) => {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 100));

    const userId = req.userId;
    const voucherCode = req.body.voucherCode;
    let totalPrice = req.body.totalPrice;
    let shippingFee = 0;
    let isVoucherForNewUser = false;
    let discountType = 'fixed';
    if (req.body.shippingFee) {
        shippingFee = req.body.shippingFee;
    }
    const totalPriceNoShip = req.body.totalPrice - shippingFee;
    let voucherName = '';
    let voucherDiscount = 0;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
        throw new NotFoundError(`Không tìm thấy người dùng với id: ${userId}`);
    }

    // Check voucher
    if (voucherCode) {
        const data = await checkVoucherIsValid(voucherCode, userId, totalPriceNoShip, shippingFee);
        console.log(data);
        voucherName = data.voucherName;
        voucherDiscount = data.voucherDiscount;
        totalPrice = data.totalPrice;
        discountType = data.discountType;
    }
    const order = new Order({
        ...req.body,
        userId: req.userId,
        voucherName,
        voucherDiscount,
        shippingFee,
        voucherCode,
        totalPrice,
        discountType,
    });

    // Pause for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const session = req.session;
    //   Update stock
    await inventoryService.updateStockOnCreateOrder(req.body.items, session);

    const newOrder = await order.save({ session });

    const template = {
        content: {
            title: 'Đơn hàng mới của bạn',
            description: 'Bạn vừa mới đặt một đơn hàng từ BITIS STORE dưới đây là sản phẩm bạn đã đặt:',
            email: newOrder.customerInfo.email,
        },
        product: {
            items: newOrder.items,
            shippingfee: newOrder.shippingFee,
            totalPrice: newOrder.totalPrice,
        },
        subject: '[BITIS STORE] - Đơn hàng mới của bạn',
        link: {
            linkHerf: `http://localhost:3000/my-orders/${newOrder._id}`,
            linkName: `Kiểm tra đơn hàng`,
        },
        user: {
            name: newOrder.customerInfo.name,
            phone: newOrder.customerInfo.phone,
            email: newOrder.customerInfo.email,
            address: `[${newOrder.shippingAddress.address}] - ${newOrder.shippingAddress.ward}, ${newOrder.shippingAddress.district}, ${newOrder.shippingAddress.province}, Việt Nam`,
        },
    };

    await sendMail({
        email: newOrder.customerInfo.email,
        template,
        type: 'UpdateStatusOrder',
    });

    await Promise.all(
        req.body.items.map(async (product) => {
            await Cart.findOneAndUpdate(
                { userId: req.userId },
                {
                    $pull: {
                        items: { product: product.productId, variant: product.variantId },
                    },
                },
                { new: true },
            ).session(session);
        }),
    );

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: order,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

//@POST Set order status to cancelled
export const cancelOrder = async (req, res, next) => {
    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.CANCELLED) {
        throw new NotAcceptableError(`You cannot cancel this order because it was cancelled before. `);
    }

    if (foundedOrder.orderStatus !== ORDER_STATUS.DELIVERED && foundedOrder.orderStatus !== ORDER_STATUS.DONE) {
        if (req.role !== ROLE.ADMIN && foundedOrder.orderStatus !== ORDER_STATUS.PENDING) {
            throw new NotAcceptableError('Bạn không được phép hủy đơn vui lòng liên hệ nếu có vấn đề');
        }
        if (req.role === ROLE.ADMIN) {
            foundedOrder.canceledBy = ROLE.ADMIN;
        }

        foundedOrder.orderStatus = ORDER_STATUS.CANCELLED;
        foundedOrder.description = req.body.description ?? '';
        foundedOrder.save();

        // Update stock
        await inventoryService.updateStockOnCancelOrder(foundedOrder.items);

        const template = {
            content: {
                title: `${req.role === ROLE.ADMIN ? 'Đơn hàng của bạn đã bị hủy bởi admin' : 'Đơn hàng của bạn đã bị hủy'}`,
                description: `${req.role === ROLE.ADMIN ? `Đơn hàng của bạn đã bị hủy bởi admin với lý do ${foundedOrder.description}, ${foundedOrder.isPaid ? `Rất xin lỗi vì sự bất tiện này hãy liên hệ ngay với chúng tôi qua số điện thoại +84 123 456 789 để cửa hàng hoàn lại ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(foundedOrder.totalPrice || 0)} cho bạn ` : ''} dưới đây là thông tin đơn hàng:` : `Bạn vừa hủy một đơn hàng với lý do ${foundedOrder.description} từ  thông tin đơn hàng:`}`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[] - Đơn hàng của bạn đã bị hủy',
            link: {
                linkHerf: `http://localhost:3000/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await rollbackVoucher(foundedOrder.voucherCode, foundedOrder.userId);
        await sendMail({
            email: foundedOrder.customerInfo.email,
            template,
            type: 'UpdateStatusOrder',
        });
    } else {
        throw new NotAcceptableError(`Đơn hàng của bạn đã được giao không thể hủy đơn`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Your order is cancelled.',
        }),
    );
};

// @Set order status to confirmed
export const confirmOrder = async (req, res, next) => {
    if (!req.role || req.role !== ROLE.ADMIN) {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }
    const productIds = foundedOrder.items.map((item) => item.productId);

    if (foundedOrder.orderStatus === ORDER_STATUS.PENDING) {
        foundedOrder.orderStatus = ORDER_STATUS.CONFIRMED;
        foundedOrder.save();
        const template = {
            content: {
                title: `Đơn hàng của bạn đã được xác nhận`,
                description: `Chúng tôi xin thông báo rằng đơn hàng của bạn với mã đơn hàng ${req.body.orderId} đã được xác nhận thành công. Đội ngũ của chúng tôi sẽ bắt đầu xử lý đơn hàng trong thời gian sớm nhất.`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[] - Đơn hàng của bạn đã được xác nhận',
            link: {
                linkHerf: `http://localhost:3000/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({
            email: foundedOrder.customerInfo.email,
            template,
            type: 'UpdateStatusOrder',
        });
    } else {
        throw new BadRequestError(`Your order is confirmed.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Your order is confirmed.',
        }),
    );
};

// @Set order status to shipping
export const shippingOrder = async (req, res, next) => {
    if (!req.role || req.role !== ROLE.ADMIN) {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOne({
        _id: req.body.orderId,
    });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.CONFIRMED) {
        foundedOrder.orderStatus = ORDER_STATUS.SHIPPING;
        await foundedOrder.save();

        const template = {
            content: {
                title: `Đơn hàng của bạn đang được giao`,
                description: `Đơn hàng của đang được giao tới bạn vui lòng để ý điện thoại. Dưới đây là thông tin đơn hàng của bạn:`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[] - Đơn hàng của bạn đang được giao',
            link: {
                linkHerf: `http://localhost:3000/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({
            email: foundedOrder.customerInfo.email,
            template,
            type: 'UpdateStatusOrder',
        });
    } else {
        throw new BadRequestError(`Your order is not confirmed.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Your order is on delivery.',
        }),
    );
};

// @ Set order status to delivered
export const deliverOrder = async (req, res, next) => {
    if (!req.role || req.role !== ROLE.ADMIN) {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.SHIPPING) {
        foundedOrder.orderStatus = ORDER_STATUS.DELIVERED;
        foundedOrder.save();
        const template = {
            content: {
                title: `Đơn hàng của bạn đã được giao thành công`,
                description: `Đơn hàng của bạn đã được xác nhận là giao thành công bởi người vận chuyển. Dưới đây là thông tin đơn hàng của bạn`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                warning: `Nếu bạn chưa nhận được hàng vui lòng liên hệ tới email của shop: adshop5785@gmail.com. Nếu đã nhận được hàng bạn vui lòng lên xác nhận lại tại trang đơn hàng của bạn. Trong trường hợp bạn đã nhận được hàng dựa theo chính sách chúng tôi sẽ cập nhật đơn hàng sang trạng thái hoàn thành sau 3 ngày!`,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[] - Đơn hàng của bạn đã được giao thành công',
            link: {
                linkHerf: `http://localhost:3000/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({
            email: foundedOrder.customerInfo.email,
            template,
            type: 'UpdateStatusOrder',
        });
    } else {
        throw new BadRequestError(`Your order is delivered.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'This order is delivered.',
        }),
    );
};

// @Set order status to done
export const finishOrder = async (req, res, next) => {
    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.DELIVERED) {
        foundedOrder.orderStatus = ORDER_STATUS.DONE;
        foundedOrder.isPaid = true;
        foundedOrder.save();
        const template = {
            content: {
                title: `Đơn hàng của bạn đã hoàn tất`,
                description: `Cảm ơn bạn đã tin tưởng và lựa chọn  cho nhu cầu mua sắm của mình.Nếu bạn cần hỗ trợ hoặc có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[] - Đơn hàng của bạn đã hoàn thành',
            link: {
                linkHerf: `http://localhost:3000/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({
            email: foundedOrder.customerInfo.email,
            template,
            type: 'UpdateStatusOrder',
        });
    } else {
        throw new BadRequestError(`Your order is done.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Your order is done.',
        }),
    );
};
