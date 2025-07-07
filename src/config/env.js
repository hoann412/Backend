import 'dotenv/config';

export const envConfig = {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || '12345678hehe',
    JWT_VERIFY: process.env.JWT_VERIFY || '1234567890ahihi',
    NODE_ENV: process.env.NODE_ENV || '12345678hehe',
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/dev',
    USER_DEFAULT_AVATAR:
        process.env.DEFAULT_IMAGE_URL ||
        'https://res.cloudinary.com/dbbontzg4/image/upload/v1744950612/anhdd_bo9rqp.png',
    shipping: {
        apiToken: process.env.SHIPPING_API_TOKEN,
        apiEndpoint: process.env.SHIPPING_API_ENDPOINT,
        shopId: process.env.SHOP_ID,
        fromDistrictId: process.env.FROM_DISTRICT_ID,
        fromWardCode: process.env.FROM_WARD_CODE,
    },
    FIREBASE: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    VN_PAY_CONFIG: {
        vnpTmnCode: process.env.VNP_TMNCODE,
        vnp_HashSecret: process.env.VNP_HASHSECRET,
        vnp_Url: process.env.VNP_URL,
        vnp_Api: process.env.VNP_API,
        vnp_ReturnUrl: process.env.VNP_RETURNURL,
        urlSuccess: process.env.VNP_RETURNURL,
    },
    nodeMailer: {
        email: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
};
