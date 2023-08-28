import express from "express";

import {
    getStoryTypes,
    getStoryTypeById,
    createStoryType,
    updateStoryType,
    deleteStoryType
} from "../controllers/StoryType.js";
import { verifyUser, pustakawanAndSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/story-types', verifyUser, pustakawanAndSuperAdminOnly, getStoryTypes);
router.get('/story-types/:id', verifyUser, pustakawanAndSuperAdminOnly, getStoryTypeById);
router.post('/story-types', verifyUser, pustakawanAndSuperAdminOnly, createStoryType);
router.patch('/story-types/:id', verifyUser, pustakawanAndSuperAdminOnly, updateStoryType);
router.delete('/story-types/:id', verifyUser, pustakawanAndSuperAdminOnly, deleteStoryType);

export default router;