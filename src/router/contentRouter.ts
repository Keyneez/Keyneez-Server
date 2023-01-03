import { Router } from "express";
import { contentController } from "../controller";
import { body } from "express-validator"

const router: Router = Router();

//* 컨텐츠 전체 조회 - 다날 정보 ( GET /content )
router.get("/", body("user_key").notEmpty(), contentController.getAllContent);

export default router;
