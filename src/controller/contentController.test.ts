import { PrismaClient } from "@prisma/client";
import request from 'supertest'
import { app, server } from "..";
import { rm } from "../constants";

describe('contentController test ', () => {
    // token 발급
    let token: any = null;
    const prisma = new PrismaClient(); 

    beforeAll(async () => {
        // 유저 회원가입
        const user = await request(app)
            .post('/user/signup')
            .send({
                "user_name" : "김규원",
                "user_birth" : "070112",
                "user_gender" : "female",
                "user_phone" : "010-1234-5678"
            })

        // 유저 성향, 관심사 등록
        const inter = await request(app)
            .patch('/user/signup')
            .set('Authorization', user.body.data.accessToken)
            .send({
                "disposition": "포근한 집이 최고",
                "interest": ["놀이공원", "대외활동"]
            })

        // 유저 비밀번호 등록
        const pwResponse = await request(app)
            .patch('/user/signup/pw')
            .set('Authorization', user.body.data.accessToken)
            .send({
                "user_password" : "password"
            })

        // 유저 로그인
        const loginResponse = await request(app)
                        .post('/user/signin')
                        .send({
                            "user_phone" : "010-1234-5678",
                            "user_password" : "password"
                        })
        token = loginResponse.body.data.accessToken;
    }) // db에 user 생성 or 회원가입 로그인 , contents 넣어두기, category 넣어두기, content-category mapping
     
     afterAll(() => {
        server.close()
     })
     
    afterAll(async () => {
        const deleteUser = prisma.user.deleteMany()
        const deleteLiked = prisma.liked.deleteMany()
      
        await prisma.$transaction([
            deleteUser,
            deleteLiked,
        ])
      
        await prisma.$disconnect()
      })

    describe ('게시물 전체 조회 GET /content', () => {
        it('200 - Ok 게시물 전체 조회 성공', async () => {
            const response = await request(app)
                        .get('/content')
                        .set('Authorization', token)
            expect(response.body.data).toHaveLength(15)
        }) 

        it('401 - Unauthorized 토큰이 없어서 실패', async () => {
            const response = await request(app)
                        .get('/content')
            expect(response).toHaveProperty("status", 401)
        })
    });

    describe ('게시물 상세 조회 GET /content/view/:content_id', () => {
        it('200 - Ok 게시물 상세 조회 성공', async () => {
            const response = await request(app)
                        .get('/content/view/1')
                        .set('Authorization', token)
                        
            expect(response.body.data).toHaveProperty("content_key", 1)
        }) 

        it('404 - Not Found 존재하지 않는 게시물', async () => {
            const response = await request(app)
                        .get('/content/view/1000')
                        .set('Authorization', token)

            expect(response).toHaveProperty("status", 404)
        })

        it('401 - Unauthorized 토큰이 없어서 실패', async () => {
            const response = await request(app)
                        .get('/content/view/1')
            expect(response).toHaveProperty("status", 401)
        })
    });

    describe ('게시물 검색 GET /content/search', () => {
        it('200 - Ok 게시물 검색 성공', async () => {
            const response = await request(app)
                        .get('/content/search')
                        .query({'keyword': '전시'})
                        .set('Authorization', token)
            expect(response).toHaveProperty("status", 200);
        }) 

        it('401 - Unauthorized 토큰이 없어서 실패', async () => {
            const response = await request(app)
                        .get('/content/search')
                        .query({'keyword': '전시'})
            expect(response).toHaveProperty("status", 401)
        })
    });

    describe ('게시물 찜하기 POST /content/save', () => {
        it('200 - Ok 게시물 찜 성공', async () => {
            const response = await request(app)
                        .post('/content/save')
                        .send({
                            "content_id" : 1
                        })
                        .set('Authorization', token)
            expect(response).toHaveProperty("status", 201);
        }) 
        
        it('404 - Not Found 존재하지 않는 게시물', async () => {
            const response = await request(app)
                        .post('/content/save')
                        .send({
                            "content_id" : 1000
                        })
                        .set('Authorization', token);
            expect(response).toHaveProperty("status", 404)
        })

        it('400 - Bad Request 이미 존재하는 찜인 경우', async () => {
            await request(app)
                        .post('/content/save')
                        .send({
                            "content_id" : 1
                        })
                        .set('Authorization', token);
            const response = await request(app)
                        .post('/content/save')
                        .send({
                            "content_id" : 1
                        })
                        .set('Authorization', token);
            expect(response).toHaveProperty("status", 400)
        })

        it('401 - Unauthorized 토큰이 없어서 실패', async () => {
            const response = await request(app)
                        .post('/content/save')
            expect(response).toHaveProperty("status", 401)
        })
    });

    describe ('찜한 게시물 조회 GET /content/liked', () => {
        it('200 - Ok 찜한 게시물 조회 성공', async() => {
            await request(app)
                .post('/content/save')
                .send({
                    "content_id" : 1
                })
                .set('Authorization', token);
            
            await request(app)
                .post('/content/save')
                .send({
                    "content_id" : 2
                })
                .set('Authorization', token);
            
            await request(app)
                .post('/content/save')
                .send({
                    "content_id" : 3
                })
                .set('Authorization', token);
            
            const response = await request(app)
                .get('/content/liked')
                .set('Authorization', token);
            expect(response.body.data).toHaveLength(3);
        })

        it('401 - Unauthorized 토큰이 없어서 실패', async () => {
            const response = await request(app)
                        .get('/content/liked')
            expect(response).toHaveProperty("status", 401)
        })
    });

});

