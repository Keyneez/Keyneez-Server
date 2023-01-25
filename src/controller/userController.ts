import { UserUpdateDTO } from './../interfaces/user/UserUpdateDTO';
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import { userService } from "../service";
import { UserCreateDTO } from '../interfaces/user/UserCreateDTO';
import jwtHandler from "../modules/jwtHandler";
import { CharacterCreateDTO } from "../interfaces/user/CharacterCreateDTO";
import { CheckIdentityDTO } from "../interfaces/user/CheckIdentityDTO";

//! user_key 받아서 처리한 부분 모두 access token으로 바꾸기 !!

//* 유저 생성 - 다날 정보 ( POST /user/signup )

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    
  //? validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST))
  }

    const userCreateDto: UserCreateDTO = req.body;
    userCreateDto.user_birth = "20" + userCreateDto.user_birth;

    //? 이미 존재하는 휴대폰 번호
    const isUser = await userService.getUserByPhone(userCreateDto.user_phone);

    if (isUser){
        return res.status(sc.ACCEPTED).send(fail(sc.ACCEPTED, rm.ALREADY_PHONE));
    }

    const data = await userService.createUser(userCreateDto);   

    //? 인증 실패
    if (!data) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL))
    }   

    //! 토큰 날리기
    const accessToken = jwtHandler.sign(data.user_key);   

    const user = {
      user_name: data.user_name,
      user_phone: data.user_phone,
      accessToken,
    };

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, user));
}

//* 유저 생성 - 성향, 관심사 ( PATCH /user/signup )

const createCharacter = async (req: Request, res: Response, next: NextFunction) => {
    const characterCreateDto: CharacterCreateDTO = req.body;
    
    const data = await userService.createCharacter(characterCreateDto);

    //? 생성 실패
    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.CHARACTER_FAIL));
    }   

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.CHARACTER_SUCCESS, data));
}

//* 유저 생성 - 비밀번호 ( PATCH /user/signup/pw )

const createPassword= async (req: Request, res: Response, next: NextFunction) => {

    const { user_key, user_password } = req.body;
    const data = await userService.createPassword(user_key, user_password)

    //? 생성 실패
    if (!data){
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.PASSWORD_FAIL));
    }

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.PASSWORD_SUCCESS, data));
}

//* 비밀번호 대조 ( POST /user/signup/pw )
const checkPassword= async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const { user_key, user_password } = req.body;

    try{
        const check = await userService.checkPassword(user_key, user_password);

        //? 존재하지 않는 User
        if(!check){
            return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NO_USER));
        }
        //? 비밀번호가 설정되어있지 않음
        if(check === sc.NO_CONTENT){
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_PASSWORD));
        }
        //? 대조 실패
        if(check === sc.UNAUTHORIZED){
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.PASSWORD_CHECK_FAIL));
        }

    
        return res.status(sc.CREATED).send(success(sc.CREATED, rm.PASSWORD_CHECK_SUCCESS));
    } catch (e) {
        console.log(error);
        //? 서버 내부에서 오류 발생
        res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

//* 유저 로그인 ( POST /user/signin )
const signInUser= async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
    const { user_phone, user_password } = req.body;

    try {
        const data = await userService.signIn(user_phone, user_password);
        //? 존재하지 않는 유저
        if (!data) return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.INVALID_USER));
        //? 비밀번호 틀림
        else if (data === sc.UNAUTHORIZED)
          return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));
    
        const accessToken = jwtHandler.sign(data);
    
        const result = {
          accessToken,
        };
    
        res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
    } catch (e) {
      console.log(error);
      //? 서버 내부에서 오류 발생
      res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
}

//* 유저 대조 - 다날*학생증/청소년증 ( POST /user/check )
const checkIdentity= async (req: Request, res: Response, next: NextFunction) => {

    const checkIdentityDto : CheckIdentityDTO = req.body;
    checkIdentityDto.user_birth = "20" + checkIdentityDto.user_birth

    const data = await userService.checkIdentity(checkIdentityDto);

    //? 존재하지 않는 유저
    if (data === sc.NOT_FOUND){
        return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.INVALID_USER));
    }

    //? OCR 대조 실패
    if (data === sc.BAD_REQUEST){
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.OCR_FAIL));
    }

    //? 성공할 경우 user ID에 해당하는 정보 같이 보내줘야 함

    return res.status(sc.OK).send(success(sc.OK, rm.OCR_SUCCESS, data));
}

//* 유저 조회 - ID 카드, 상세 정보 ( GET /user )
const getUser= async (req: Request, res: Response, next: NextFunction) => {

    const { user_key } = req.body;

    const user = await userService.getUser(user_key)

    if (user === sc.NOT_FOUND){
        return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.INVALID_USER));
    }

    //? 인증되지 않은 유저
    //return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_USER));


    //? 성공할 경우 user ID에 해당하는 정보 같이 보내줘야 함
    return res.status(sc.OK).send(success(sc.OK, rm.READ_USER_SUCCESS, user));
}


//* 유저 수정 ( PATCH /user )
const updateUser = async (req: Request, res: Response, next: NextFunction) => {

    const { user_key } = req.body;
    const userUpdateDto: UserUpdateDTO = req.body;

    const data = await userService.updateUser(user_key, userUpdateDto);

    //? 유저 수정 실패
    if (data === sc.BAD_REQUEST){
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.UPDATE_USER_FAIL));
    }

    //? 인증되지 않은 유저
    //return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_USER));

    
    //? 성공할 경우 user ID에 해당하는 정보 같이 보내줘야 함

    return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_USER_SUCCESS, data));
}

//* 유저 삭제 ( DELETE /user )

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user_key } = req.body;

    //? 인증되지 않은 유저
    //return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_USER));

    //? 삭제 실패
    //return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DELETE_USER_FAIL));

    //? 삭제 성공
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_USER_SUCCESS));
}

const userController = {
    createUser,
    createCharacter,
    createPassword,
    checkPassword,
    signInUser,
    checkIdentity,
    getUser,
    updateUser,
    deleteUser
};

export default userController;
