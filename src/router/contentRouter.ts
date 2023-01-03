import { Router } from "express";
import { contentController } from "../controller";

const router: Router = Router();

//* 컨텐츠 전체 조회 - 다날 정보 ( GET /content )
router.get("/", contentController.getAllContent);

export default router;
