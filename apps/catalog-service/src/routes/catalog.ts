import { Router } from "express";
import multer from "multer";
import { createFood, listFoods, getFoodById, updateFood, deleteFood, listAllFoods} from "../controllers/catalogController";
import { verifyAdmin } from "../middleware/authMiddleware";

const router = Router();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});




const upload = multer({ storage });

// Admin routes
router.post("/", verifyAdmin, upload.single("image"), createFood);

// Public route
router.get("/", listAllFoods);
router.get("/:id", getFoodById);
router.put("/:id", verifyAdmin, upload.single("image"), updateFood);
router.delete("/:id", verifyAdmin, deleteFood);


export default router;
