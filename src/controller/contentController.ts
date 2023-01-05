import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import contentService from "../service/contentService";
import { userService } from '../service';

//* 컨텐츠 전체 조회 ( GET /content )
const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST))
  }
  
  const { user_key } = req.body;

  const data = await contentService.getAllContent(+user_key);

  // //? 존재하지 않는 유저일때
  const user = await userService.getUser(user_key)
  if(!user){
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
  }

  //? 서버 내부 오류로 인한 조회 실패
  if (!data) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

  return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_CONTENTS_SUCCESS, data));
};

//* 컨텐츠 상세 조회 ( GET /content/:content_id )
const getOneContent = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST))
  }
  
  const { user_key } = req.body;
  const { content_id } = req.params;
  const data = await contentService.getOneContent(+user_key, +content_id);

  // //? 존재하지 않는 유저일때
  const user = await userService.getUser(user_key)
  if(!user){
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
  }

  //? 서버 내부 오류로 인한 조회 실패
  if (!data) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

  return res.status(sc.OK).send(success(sc.OK, rm.READ_CONTENT_SUCCESS, data));
};

const searchContent = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST))
  }
  
  const { user_key } = req.body;
  const { keyword } = req.query;

  const data = await contentService.searchContent(keyword as string, +user_key);

  // //? 존재하지 않는 유저일때
  const user = await userService.getUser(user_key)
  if(!user){
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
  }

  //? 서버 내부 오류로 인한 조회 실패
  if (!data) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

  return res.status(sc.OK).send(success(sc.OK, rm.SEARCH_CONTENT, data));
};


const contentController = {
  getAllContent,
  getOneContent,
  searchContent,
};

export default contentController;
