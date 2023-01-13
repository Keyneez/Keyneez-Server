import { PrismaClient } from "@prisma/client";
import request from 'supertest'
import { app } from "..";
import { rm } from "../constants";

describe('userController test', () => {
    // token 발급
    let token: any = null;
    const prisma = new PrismaClient(); 

    describe('회원가입 (다날 인증 -> 성향/관심사 -> 비밀번호) test', () => {
        // 유저 회원가입
        it('201- 다날 인증 성공', async() => {
            const userSignin = await request(app)
            .post('/user/signup')
            .send({
                "user_name" : "박서원",
                "user_birth" : "010806",
                "user_gender" : "female",
                "user_phone" : "010-1111-2222"
            })
            expect(userSignin.body).toHaveProperty("message", rm.SIGNUP_SUCCESS)
            token = userSignin.body.data.accessToken;
        })

        it('202- 이미 존재하는 유저', async() => {
            const userSignin = await request(app)
            .post('/user/signup')
            .send({
                "user_name" : "박서원",
                "user_birth" : "010806",
                "user_gender" : "female",
                "user_phone" : "010-1111-2222"
            })
            expect(userSignin.body).toHaveProperty("status", 202)
        })

        // 유저 성향, 관심사 등록
        it('201- 캐릭터 발급 성공', async() => {
            const getCharacter = await request(app)
            .patch('/user/signup')
            .set('Authorization', token)
            .send({
                "disposition": "포근한 집이 최고",
                "interest": ["놀이공원", "대외활동"]
            })
            expect(getCharacter.body).toHaveProperty("message", rm.CHARACTER_SUCCESS)
        })

        it('401- Unauthorized 토큰이 없어서 실패', async() => {
            const getCharacter = await request(app)
            .patch('/user/signup')
            .send({
                "disposition": "포근한 집이 최고",
                "interest": ["놀이공원", "대외활동"]
            })
            expect(getCharacter.body).toHaveProperty("status", 401)
        })

        it('201- 비밀번호 생성 성공',async () => {
            // 유저 비밀번호 등록
            const pwResponse = await request(app)
            .patch('/user/signup/pw')
            .set('Authorization', token)
            .send({
                "user_password" : "123456"
            })
            expect(pwResponse.body).toHaveProperty("message", rm.PASSWORD_SUCCESS)
        })

        it('401- Unauthorized 토큰이 없어서 실패',async () => {
            // 유저 비밀번호 등록
            const pwResponse = await request(app)
            .patch('/user/signup/pw')
            .send({
                "user_password" : "123456"
            })
            expect(pwResponse.body).toHaveProperty("status", 401)
        })

        // 유저 비밀번호 대조
        it('201- 비밀번호 대조 성공',async () => {
            const pwResponse = await request(app)
            .post('/user/signup/pw')
            .set('Authorization', token)
            .send({
                "user_password" : "123456"
            })
            expect(pwResponse.body).toHaveProperty("message", rm.PASSWORD_CHECK_SUCCESS)
        })

        it('400- 비밀번호 대조 실패',async () => {
            const pwResponse = await request(app)
            .post('/user/signup/pw')
            .set('Authorization', token)
            .send({
                "user_password" : "12356"
            })
            expect(pwResponse.body).toHaveProperty("status", 400)
        })
    })
        
    describe('로그인, 학생증/청소년증 대조, 유저 정보 조회 test', () => {
        // 유저 로그인
        it('200- 유저 로그인 성공',async () => {
            const loginResponse = await request(app)
            .post('/user/signin')
            .send({
                "user_phone" : "010-1111-2222",
                "user_password" : "123456"
            })
            expect(loginResponse.body).toHaveProperty("message", rm.SIGNIN_SUCCESS)
            token = loginResponse.body.data.accessToken;
        })

        it('404- 존재하지 않는 유저',async () => {
            const loginResponse = await request(app)
            .post('/user/signin')
            .send({
                "user_phone" : "010-1234-124",
                "user_password" : "123456"
            })
            expect(loginResponse.body).toHaveProperty("status", 404)
        })
        it('401- 잘못된 비밀번호',async () => {
            const loginResponse = await request(app)
            .post('/user/signin')
            .send({
                "user_phone" : "010-1111-2222",
                "user_password" : "12346"
            })
            expect(loginResponse.body).toHaveProperty("status", 401)
        })

        it('200- 학생증/청소년증 대조 성공', async () => {
            const userCheck = await request(app)
            .post('/user/check')
            .set('Authorization', token)
            .send({
                    "user_school": "한국외국어대학교",
                    "user_name": "박서원",
                    "user_ocr": "s3_link",
                    "ocr_dir": true
            })
            expect(userCheck.body).toHaveProperty("message", rm.OCR_SUCCESS)
        })

        it('200- 유저 조회 성공', async () => {
            const getUser = await request(app)
            .get('/user')
            .set('Authorization', token)
            expect(getUser.body).toHaveProperty("message", rm.READ_USER_SUCCESS)
        })
    })

});