import { Router } from "express";
import { userController } from "../controller";
import { body } from "express-validator"

const router: Router = Router();

//* 유저 생성 - 다날 정보 ( POST /user/signup )
router.post(
    "/signup",
    [body("user_name").notEmpty(), body("user_birth").notEmpty(), body("user_gender").notEmpty(), body("user_tel"), body("user_phone")],
    userController.createUser
);

//* 유저 생성 - 성향, 관심사 ( PATCH /user/signup )
router.patch("/signup", userController.createCharacter);

//* 유저 생성 - 비밀번호 ( PATCH /user/signup/pw )
router.patch("/signup/pw", userController.createPassword);

//* 비밀번호 대조 ( POST /user/signup/pw )
router.post("/signup/pw", userController.checkPassword);

//* 유저 로그인 ( POST /user/signin )
router.post("/signin", userController.signInUser);

//* 유저 대조 - 다날*학생증/청소년증 ( POST /user/check )
router.post("/check", userController.checkIdentity);

//* 유저 조회 - ID 카드, 상세 정보 ( GET /user )
router.get("/", userController.getUser);

// //* 유저 조회 - 실물 인증 ( GET /user/mycard )
// router.get("/mycard", userController.getUserCard);

//* 유저 수정 ( PATCH /user )
router.patch("/", userController.updateUser);

//* 유저 삭제 ( DELETE /user )
router.delete("/", userController.deleteUser);

export default router;
