import express from "express";

import {
    getDigitalFormats,
    getDigitalFormatById,
    createDigitalFormat,
    updateDigitalFormat,
    deleteDigitalFormat
} from "../controllers/DigitalFormat.js";
import { verifyUser, superAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/digital-format', verifyUser, superAdminOnly, getDigitalFormats);
router.get('/digital-format/:id', verifyUser, superAdminOnly, getDigitalFormatById);
router.post('/digital-format', verifyUser, superAdminOnly, createDigitalFormat);
router.patch('/digital-format/:id', verifyUser, superAdminOnly, updateDigitalFormat);
router.delete('/digital-format/:id', verifyUser, superAdminOnly, deleteDigitalFormat);

export default router;