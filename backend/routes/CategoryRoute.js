import express from "express";

import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/Category.js";
import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/categories', verifyUser, pustakawanAndSuperAdminOnly, getCategories);
router.get('/categories/:id', verifyUser, pustakawanAndSuperAdminOnly, getCategoryById);
router.post('/categories', verifyUser, pustakawanAndSuperAdminOnly, createCategory);
router.patch('/categories/:id', verifyUser, pustakawanAndSuperAdminOnly, updateCategory);
router.delete('/categories/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteCategory);

export default router;