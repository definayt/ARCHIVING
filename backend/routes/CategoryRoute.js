import express from "express";

import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/Category.js";
import { verifyUser, superAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/categories', verifyUser, superAdminOnly, getCategories);
router.get('/categories/:id', verifyUser, superAdminOnly, getCategoryById);
router.post('/categories', verifyUser, superAdminOnly, createCategory);
router.patch('/categories/:id', verifyUser, superAdminOnly, updateCategory);
router.delete('/categories/:id', verifyUser, superAdminOnly, deleteCategory);

export default router;