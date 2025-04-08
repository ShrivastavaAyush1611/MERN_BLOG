import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import AuthRoute from './routes/Auth.route.js'
import UserRoute from './routes/User.route.js'
import CategoryRoute from './routes/Category.route.js'
import BlogRoute from './routes/Blog.route.js'
import CommentRoute from './routes/Comment.route.js'
import BlogLikeRoute from './routes/Bloglike.route.js'


dotenv.config()

const PORT= process.env.PORT
const app = express()
app.use(cookieParser())  //this is used to send the cookie from backend to frontend an it is used to get data from cookie
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", // Ensure this matches the frontend URL
    credentials: true, // Allow cookies to be sent
}))

//route setup
app.use('/api/auth',AuthRoute)
app.use('/api/user', UserRoute); // Ensure this route is correctly set up
app.use('/api/category', CategoryRoute); // Ensure this matches the frontend fetch URL
app.use('/api/blog', BlogRoute)
app.use('/api/comment',CommentRoute)
app.use('/api/blog-like', BlogLikeRoute)



mongoose.connect(process.env.MONGODB_CONN,{dbName:'mern-blog'})
.then(()=>console.log('Database connected'))
.catch(err => console.log('Database connection failed',err))

app.listen(PORT,()=>{
    console.log('Server running on Port:',PORT);
})

app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error.';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
