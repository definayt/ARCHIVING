import express from "express";

import {
    getLanguages,
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage
} from "../controllers/Language.js";
import { verifyUser, superAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/languages', verifyUser, superAdminOnly, getLanguages);
router.get('/languages/:id', verifyUser, superAdminOnly, getLanguageById);
router.post('/languages', verifyUser, superAdminOnly, createLanguage);
router.patch('/languages/:id', verifyUser, superAdminOnly, updateLanguage);
router.delete('/languages/:id', verifyUser, superAdminOnly, deleteLanguage);

export default router;