import express from "express";
import {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controller/quiz/controller.quiz";
import {
  getUsers,
  getUser,
  registerUser,
  loginUser,
} from "../controller/user/controller.user";
import { isObjectID } from "../middleware/auth/objectID";
import { notFound, errorHandler } from "../middleware/error";
const router = express.Router();

// Quiz Section
router.get("/api/getQuizzes", getQuizzes);
router.get("/api/getQuiz/:id", isObjectID, getQuiz);
router.post("/api/createQuiz", createQuiz);
router.put("/api/updateQuiz/:id", isObjectID, updateQuiz);
router.delete("/api/deleteQuiz/:id", isObjectID, deleteQuiz);

// User Section
router.get("/api/getUsers", getUsers);
router.get("/api/getUser/:id", isObjectID, getUser);
router.post("/api/registerUser", registerUser);
router.post("/api/loginUser", loginUser);

router.use(notFound);
router.use(errorHandler);

export default router;
