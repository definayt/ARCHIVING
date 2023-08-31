import express from "express";

import {
    getDigitalCollectionsUnique,
    readExcel
} from "../controllers/DigitalCollections.js";

import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/digital-collections', verifyUser, getDigitalCollectionsUnique);
router.post('/digital-collections/excel', verifyUser, pustakawanAndSuperAdminOnly, readExcel)

export default router;