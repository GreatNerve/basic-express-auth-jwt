import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './../src/utils/connectDB.js';
import userRoute from './../src/routes/userRoute.js';



const app = express();
app.use(express.json({
    limit: '10kb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}));

app.use(cookieParser(process.env.COOKIE_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
}));

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.get('/', (req, res) => {
    res.json({
        message: 'API is working properly'
    });
});

app.use('/api/v1/users', userRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});


export default app;