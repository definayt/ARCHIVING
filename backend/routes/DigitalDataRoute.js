import express from "express";

import {
    getDigitalDatas,
    getDigitalDataById,
    createDigitalData,
    updateDigitalData,
    deleteDigitalData
} from "../controllers/DigitalData.js";
import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/digital-data', verifyUser, pustakawanAndSuperAdminOnly, getDigitalDatas);
router.get('/digital-data/:id', verifyUser, pustakawanAndSuperAdminOnly, getDigitalDataById);
router.post('/digital-data', verifyUser, pustakawanAndSuperAdminOnly, createDigitalData);
router.patch('/digital-data/:id', verifyUser, pustakawanAndSuperAdminOnly, updateDigitalData);
router.delete('/digital-data/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteDigitalData);

export default router;