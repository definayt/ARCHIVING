import express from "express";

import {
    getCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    readExcel,
    findAllCollection
} from "../controllers/Collections.js";

import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/collections', verifyUser, getCollections);
router.get('/collections/:id', verifyUser, getCollectionById);
router.post('/collections', verifyUser, pustakawanAndSuperAdminOnly, createCollection);
router.patch('/collections/:id', verifyUser, pustakawanAndSuperAdminOnly, updateCollection);
router.delete('/collections/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteCollection);
router.post('/collections/excel', verifyUser, pustakawanAndSuperAdminOnly, readExcel)
router.get("/collection", verifyUser, pustakawanAndSuperAdminOnly, findAllCollection);

export default router;