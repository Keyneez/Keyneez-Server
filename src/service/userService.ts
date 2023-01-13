import { CharacterResDTO } from './../interfaces/user/CharacterResDTO';
import { CheckIdentityDTO } from './../interfaces/user/CheckIdentityDTO';
import { PrismaClient } from "@prisma/client";
import { sc } from "../constants";
import bcrypt from "bcryptjs";
import { UserCreateDTO } from "../interfaces/user/UserCreateDTO";
import { CharacterCreateDTO } from "../interfaces/user/CharacterCreateDTO";
import { UserUpdateDTO } from '../interfaces/user/UserUpdateDTO';

const prisma = new PrismaClient();


//* 이미 인증된 휴대폰 번호인 지 조회
const getUserByPhone = async (user_phone: string) => {
    const data = await prisma.user.findUnique({
        where: {
            user_phone,
        }
    })

    return data;
}

//* 유저 생성 - 다날 정보 ( POST /user/signup )
const createUser = async (userCreateDto: UserCreateDTO) => {
  
    const data = await prisma.user.create({
      data: {
        ...userCreateDto
      },
    });
  
    return data;
};

//* 유저 생성 - 성향, 관심사 ( PATCH /user/signup )

const createCharacter = async (characterCreateDTO: CharacterCreateDTO) => {
    const characters = require('./../data/character.json');
    const dispo : string = characters["disposition"][characterCreateDTO.disposition];

    const inter : string[]= characterCreateDTO.interest.map((i) => {
        return characters["interests"][i.toString()];
    })

    let interestFin = inter[0];

    if (inter[0] === "혜택"){
        interestFin = inter[1];
    }

    const count = {
        culture: inter.filter(i => "문화인" === i).length,
        career: inter.filter(i => "진로탐색러" === i).length,
        explore: inter.filter(i => "탐험가" === i).length,
        economy: inter.filter(i => "경제인" === i).length,
        serve: inter.filter(i => "봉사자" === i).length,
        benefit: inter.filter(i => "혜택" === i).length
    }

    if (count.culture >= 2) interestFin = "문화인"
    if (count.career >= 2) interestFin = "진로탐색러"
    if (count.explore >= 2) interestFin = "탐험가"
    if (count.economy >= 2) interestFin = "경제인"
    if (count.serve >= 2) interestFin = "봉사자"
    if (count.benefit >= 1) characterCreateDTO.benefit = true;

    const character = await prisma.characters.findFirst({
        where: {
            dispo,
            inter: interestFin,
        },
    })

    const pushChar = await prisma.user.update({
        where: {
            user_key: characterCreateDTO.user_key
        },
        data: {
            user_character: character?.character_key,
            user_benefit: characterCreateDTO.benefit
        }
    })
    

    const charFin : CharacterResDTO | null = await prisma.user.findFirst({
        where: {
            user_key: characterCreateDTO.user_key
        },
        include: {
            Characters: true,
        },
    })

    const getItem = await prisma.items.findMany({
        where: {
            item_inter: character?.inter
        },
        select: {
            items_key: true,
            item_img: true,
            item_name: true
        }
    })
    
    if (charFin) charFin.Items = getItem;

    return charFin;
}

//* 유저 생성 - 비밀번호 ( PATCH /user/signup/pw )

const createPassword = async (user_key: number, user_password: string) => {
    //? 넘겨받은 password를 bcrypt의 도움을 받아 암호화
    const salt = await bcrypt.genSalt(10); //^ 매우 작은 임의의 랜덤 텍스트 salt
    const pw = await bcrypt.hash(user_password, salt); //^ 위에서 랜덤을 생성한 salt를 이용해 암호화
  
    const data = await prisma.user.update({
        where: {
            user_key,
        },
        data: {
          user_password: pw,
        },
    });

    const pwFin = await prisma.user.findFirst({
        where: {
            user_key,
        },
        select: {
            user_name: true,
            user_phone: true,
            user_password: true
        }
    })
  
    return pwFin;
};

//* 비밀번호 대조 ( POST /user/signup/pw )

const checkPassword = async (user_key: number, user_password: string) => {
    try{
        //? 넘겨받은 password를 bcrypt의 도움을 받아 암호화
        const user = await prisma.user.findFirst({
            where: {
                user_key,
            },
        });

        if (!user) return null;

        if (!user.user_password) return sc.NO_CONTENT;

        const isMatch = await bcrypt.compare(user_password, user.user_password);

        if (!isMatch) return sc.UNAUTHORIZED;

        return user.user_key;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//* 유저 로그인 ( POST /user/signin )

const signIn = async (user_phone: string, user_password: string) => {
    try{
        //? 넘겨받은 password를 bcrypt의 도움을 받아 암호화
        const user = await prisma.user.findFirst({
            where: {
                user_phone,
            },
        });

        if (!user) return null;

        if (!user.user_password) return sc.NO_CONTENT;

        const isMatch = await bcrypt.compare(user_password, user.user_password);

        if (!isMatch) return sc.UNAUTHORIZED;

        return user.user_key;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//* 유저 대조 - 다날*학생증/청소년증 ( POST /user/check )

const checkIdentity = async (checkIdentityDto: CheckIdentityDTO) => {
    //! ocr이 들어오지 않을 경우에 대한 처리 추가하기

    const user = await prisma.user.findFirst({
        where: {
            user_key: checkIdentityDto.user_key,
        }
    });

    if (!user) return sc.NOT_FOUND

    if (user?.user_name !== checkIdentityDto.user_name) return sc.BAD_REQUEST
    

    //? 학생증
    if (checkIdentityDto.user_school) {
        const userSchool = await prisma.user.update({
            where: {
                user_key: checkIdentityDto.user_key,
            },
            data: {
                user_school: checkIdentityDto.user_school,
                user_ocr: checkIdentityDto.user_ocr,
                ocr_dir: checkIdentityDto?.ocr_dir
            },
        })

        if (!userSchool) return sc.BAD_REQUEST

        const result = await prisma.user.findFirst({
            where: {
                user_key: checkIdentityDto.user_key,
            },
            include: {
                Characters: true,
            }
        })

        return result
    }
    
    //? 청소년증
    if (checkIdentityDto.user_birth) {

        const userBirth = user?.user_birth.substring(2);

        if (userBirth == checkIdentityDto.user_birth){
            const userOcr = await prisma.user.update({
                where: {
                    user_key: checkIdentityDto.user_key,
                },
                data: {
                    user_ocr: checkIdentityDto.user_ocr,
                    ocr_dir: checkIdentityDto?.ocr_dir
                },
            })

            if (!userOcr) return sc.BAD_REQUEST

            const result = await prisma.user.findFirst({
                where: {
                    user_key: checkIdentityDto.user_key,
                },
                include: {
                    Characters: true,
                }
            })

            return result
        }

        return sc.BAD_REQUEST
    }
};

//* 유저 조회 - ID 카드, 상세 정보 ( GET /user )

const getUser = async (user_key: number) => {
    const user = await prisma.user.findFirst({
        where: {
            user_key,
        },
        include: {
            Characters: true,
        }
    });

    if (!user) return sc.NOT_FOUND

    return user
};


//* 유저 수정 ( PATCH /user )

const updateUser = async (user_key: number, userUpdateDto: UserUpdateDTO) => {

    const update = await prisma.user.update({
        where: {
            user_key,
        },
        data:{
            ...userUpdateDto
        }
    })

    if (!update) return sc.BAD_REQUEST

    const user = await prisma.user.findFirst({
        where: {
            user_key,
        },
        select: {
            user_name: true,
            user_school: true,
            user_birth: true,
            user_ocr: true,
            ocr_dir: true,
        }
    });

    return user
    
};

//* 유저 삭제 ( DELETE /user )


const userService = {
    getUserByPhone,
    createUser,
    createCharacter,
    createPassword,
    checkPassword,
    signIn,
    checkIdentity,
    getUser,
    updateUser,
};

export default userService;
