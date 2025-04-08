
import { handleErrors } from "../helpers/handleErrors.js";
import Category from "../models/category.model.js"

export const addCategory = async (req, res, next) => {
    try {
        // console.log('Request body:', req.body); // Debugging log
        const { name, slug } = req.body
        const category = new Category({
            name, slug
        })

        await category.save()

        res.status(200).json({
            success: true,
            message: 'Category added successfully.'
        })

    } catch (error) {
        console.error('Error adding category:', error.message); // Debugging log
        next(handleErrors(500, error.message))
    }
}
export const showCategory = async   (req, res, next) => {
    try {
        const { categoryid } = req.params
        const category = await Category.findById(categoryid)
        if (!category) {
            next(handleErrors(404, 'Data not found.'))
        }
        res.status(200).json({
            category
        })
    } catch (error) {
        next(handleErrors(500, error.message))
    }
}
export const updateCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body
        const { categoryid } = req.params
        const category = await Category.findByIdAndUpdate(categoryid, {
            name, slug
        }, { new: true })

        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            category
        })
    } catch (error) {
        next(handleErrors(500, error.message))
    }
}
export const deleteCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params
        await Category.findByIdAndDelete(categoryid)
        res.status(200).json({
            success: true,
            message: 'Category Deleted successfully.',
        })
    } catch (error) {
        next(handleErrors(500, error.message))
    }
}
export const getAllCategory = async (req, res, next) => {
    try {
        const category = await Category.find().sort({ name: 1 }).lean().exec()
        res.status(200).json({
            category
        })
    } catch (error) {
        next(handleErrors(500, error.message))
    }
}