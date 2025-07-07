import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import router from './routers/index.js';
import notFoundHandler from './errors/notFoundHandler.js';
import errorHandler from './errors/errorHandle.js';
import { envConfig } from './config/env.js';
import { initializeApp } from 'firebase/app';
import { handleInsertData } from './data/index.js';
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Length'],
};

// firebase
initializeApp(envConfig.FIREBASE);

// middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
// connect db
connectDB(envConfig.DB_URL);

app.use('/static', express.static('public'));

// routers
app.use('/api', router);
app.use('/api/import-data', handleInsertData);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(envConfig.PORT, () => {
    console.log('Server is running on port ' + envConfig.PORT);
});
