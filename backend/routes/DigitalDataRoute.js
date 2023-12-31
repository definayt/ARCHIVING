import express from "express";

import {
    getDigitalDatas,
    getDigitalDataById,
    createDigitalData,
    updateDigitalData,
    deleteDigitalData,
    readExcel,
    findAllDigitalData,
    exportExcelDigitalData
} from "../controllers/DigitalData.js";
import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/digital-data', verifyUser, getDigitalDatas);
router.get('/digital-data/:id', verifyUser, getDigitalDataById);
router.post('/digital-data', verifyUser, pustakawanAndSuperAdminOnly, createDigitalData);
router.patch('/digital-data/:id', verifyUser, pustakawanAndSuperAdminOnly, updateDigitalData);
router.delete('/digital-data/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteDigitalData);
router.post('/digital-data/excel', verifyUser, pustakawanAndSuperAdminOnly, readExcel)
router.get("/digital-data-2", verifyUser, findAllDigitalData);
router.get("/digital-data-export", verifyUser, exportExcelDigitalData);

export default router;