import express from 'express';
import { deleteUser, getAllUser, getUser,updateUser } from '../controllers/User.controller.js';
import upload from '../config/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const UserRoute = express.Router();

// Route to fetch user data by ID

UserRoute.use(authenticate)

UserRoute.get('/get-user/:userid', getUser);
UserRoute.put('/update-user/:userid',upload.single('file'), updateUser);
UserRoute.get('/get-all-user', getAllUser)
UserRoute.delete('/delete/:id', deleteUser)

export default UserRoute;