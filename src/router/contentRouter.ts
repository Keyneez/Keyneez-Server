import { query, Router } from "express";
import { contentController } from "../controller";
import { body } from "express-validator"

const router: Router = Router();

//* 컨텐츠 전체 조회 ( GET /content )
router.get("/", body("user_key").notEmpty(), contentController.getAllContent);

//* 컨텐츠 상세 조회 ( GET /content/view/:contentId)
router.get("/view/:content_id", body("user_key").notEmpty(), contentController.getOneContent);

//* 컨텐츠 검색 ( GET /content/search?keyword= )
router.get("/search", body("user_key").notEmpty(), contentController.searchContent);

//* 컨텐츠 찜 ( POST /content/save)
router.post("/save", body("user_key").notEmpty(), body("content_id") , contentController.createLiked);

//* 컨텐츠 찜 조회 ( GET /content/liked)
router.get("/liked", body("user_key").notEmpty(), contentController.getLiked);

export default router;
