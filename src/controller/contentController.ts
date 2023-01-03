import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import contentService from "../service/contentService";

//* 컨텐츠 전체 조회 ( GET /content )
const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST))
  }
  
  const { user_key } = req.body;

  const data = await contentService.getAllContent(+user_key);

  //! 유저 조회 api 개발되면 userService 끌고 와서 붙이기 필요 
  // //? 존재하지 않는 유저일때
  // return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));

  //? 서버 내부 오류로 인한 조회 실패
  if (!data) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

  return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_CONTENTS_SUCCESS, data));
};

const contentController = {
  getAllContent,
};

export default contentController;
