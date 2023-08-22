import express from "express";

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/Users.js";
import { verifyUser, superAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, superAdminOnly, getUsers);
router.get('/users/:id', verifyUser, superAdminOnly, getUserById);
router.post('/users', verifyUser, superAdminOnly, createUser);
router.patch('/users/:id', verifyUser, superAdminOnly, updateUser);
router.delete('/users/:id', verifyUser, superAdminOnly, deleteUser);

export default router;