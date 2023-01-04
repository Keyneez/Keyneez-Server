import { Router } from "express";
import { contentController } from "../controller";
import { body } from "express-validator"

const router: Router = Router();

//* 컨텐츠 전체 조회 ( GET /content )
router.get("/", body("user_key").notEmpty(), contentController.getAllContent);

//* 컨텐츠 상세 조회 ( GET /content/view/:contentId)
router.get("/view/:content_id", body("user_key").notEmpty(), contentController.getOneContent);

export default router;
