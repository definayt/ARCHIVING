import express from "express";

import {
    getStoryTypes,
    getStoryTypeById,
    createStoryType,
    updateStoryType,
    deleteStoryType
} from "../controllers/StoryType.js";
import { verifyUser, superAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/story-types', verifyUser, superAdminOnly, getStoryTypes);
router.get('/story-types/:id', verifyUser, superAdminOnly, getStoryTypeById);
router.post('/story-types', verifyUser, superAdminOnly, createStoryType);
router.patch('/story-types/:id', verifyUser, superAdminOnly, updateStoryType);
router.delete('/story-types/:id', verifyUser, superAdminOnly, deleteStoryType);

export default router;