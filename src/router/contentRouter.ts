import { query, Router } from "express";
import { contentController } from "../controller";
import { body } from "express-validator"
import { auth } from "../middlewares";

const router: Router = Router();

//* 컨텐츠 전체 조회 ( GET /content )
router.get("/", auth, contentController.getAllContent);

//* 컨텐츠 상세 조회 ( GET /content/view/:contentId)
router.get("/view/:content_id", auth, contentController.getOneContent);

//* 컨텐츠 검색 ( GET /content/search?keyword= )
router.get("/search", auth, contentController.searchContent);

//* 컨텐츠 찜 ( POST /content/save)
router.post("/save", auth, body("content_id").notEmpty() , contentController.createLiked);

//* 컨텐츠 찜 조회 ( GET /content/liked)
router.get("/liked", auth, contentController.getLiked);

export default router;
