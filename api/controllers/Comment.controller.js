import { handleErrors } from "../helpers/handleErrors.js"
import Comment from "../models/comment.model.js"

export const addcomment = async (req, res, next) => {
  try {
    const { user, blogid, comment } = req.body;

    // Validate required fields
    if (!user) {
      return next(handleErrors(400, "User is required."));
    }
    if (!blogid) {
      return next(handleErrors(400, "Blog ID is required."));
    }
    if (!comment || comment.trim().length < 3) {
      return next(handleErrors(400, "Comment must be at least 3 characters long."));
    }

    const newComment = new Comment({
      user,
      blogid,
      comment,
    });

    await newComment.save();
    res.status(200).json({
      success: true,
      message: 'Comment submitted.',
      comment: newComment,
    });
  } catch (error) {
    next(handleErrors(500, error.message));
  }
};

export const getComments = async (req, res, next) => {
    try {
        const { blogid } = req.params
    //    const comments = await Comment.find({ blogid }).populate('user', 'name avatar').sort({ createdAt: -1 }).lean().exec()
          const comments = await Comment.find({ blogid }).populate('user' , 'name avatar').sort({
            createdAt: -1
          }).lean().exec()
        res.status(200).json({
            comments,
        });
    } catch (error) {
        next(handleErrors(500, error.message));
    }
};


export const commentCount = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const commentCount = await Comment.countDocuments({ blogid })

        res.status(200).json({
            commentCount
        })
    } catch (error) {
        next(handleErrors(500, error.message))
    }
}

export const getAllComments = async (req, res, next) => {
    try {
    const user = req.user
       let comments
        if (user.role === 'admin') {
            comments = await Comment.find().populate('blogid', 'title').populate('user', 'name')

        } else {

            comments = await Comment .find({ user: user._id }).populate('blogid', 'title').populate('user', 'name')
        }

        // const comments = await Comment.find()
        //     .populate('blogid', 'title')
        //     .populate('user', 'name')
        //     .sort({ createdAt: -1 })
        //     .lean()
        //     .exec();

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        next(handleErrors(500, error.message));
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { commentid } = req.params;
        await Comment.findByIdAndDelete(commentid);

        res.status(200).json({
            success: true,
            message: 'Data deleted',
        });
    } catch (error) {
        next(handleErrors(500, error.message)); // Fixed typo here
    }
};