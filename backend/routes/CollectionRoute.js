import express from "express";

import {
    getCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    readExcel,
    findAllCollection,
    countAllCollection,
    countCategory,
    countStoryType, 
    countLanguage,
    countPublished1stYear
} from "../controllers/Collections.js";

import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/collections', verifyUser, getCollections);
router.get('/collections/:id', verifyUser, getCollectionById);
router.post('/collections', verifyUser, pustakawanAndSuperAdminOnly, createCollection);
router.patch('/collections/:id', verifyUser, pustakawanAndSuperAdminOnly, updateCollection);
router.delete('/collections/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteCollection);
router.post('/collections/excel', verifyUser, pustakawanAndSuperAdminOnly, readExcel);
router.get("/collection/count-all", verifyUser, countAllCollection);
router.get("/collection/count-category", verifyUser, countCategory);
router.get("/collection/count-story-type", verifyUser, countStoryType);
router.get("/collection/count-language", verifyUser, countLanguage);
router.get("/collection/count-publish-1st-year", verifyUser, countPublished1stYear);
router.get("/collection", verifyUser, pustakawanAndSuperAdminOnly, findAllCollection);

export default router;