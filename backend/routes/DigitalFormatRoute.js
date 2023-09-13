import express from "express";

import {
    getDigitalFormats,
    getDigitalFormatById,
    createDigitalFormat,
    updateDigitalFormat,
    deleteDigitalFormat
} from "../controllers/DigitalFormat.js";
import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/digital-format', verifyUser, getDigitalFormats);
router.get('/digital-format/:id', verifyUser, pustakawanAndSuperAdminOnly, getDigitalFormatById);
router.post('/digital-format', verifyUser, pustakawanAndSuperAdminOnly, createDigitalFormat);
router.patch('/digital-format/:id', verifyUser, pustakawanAndSuperAdminOnly, updateDigitalFormat);
router.delete('/digital-format/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteDigitalFormat);

export default router;