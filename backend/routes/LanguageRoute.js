import express from "express";

import {
    getLanguages,
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage
} from "../controllers/Language.js";
import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/languages', verifyUser, getLanguages);
router.get('/languages/:id', verifyUser, pustakawanAndSuperAdminOnly, getLanguageById);
router.post('/languages', verifyUser, pustakawanAndSuperAdminOnly, createLanguage);
router.patch('/languages/:id', verifyUser, pustakawanAndSuperAdminOnly, updateLanguage);
router.delete('/languages/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteLanguage);

export default router;