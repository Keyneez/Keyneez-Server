# Keyneez-Server

![image](https://user-images.githubusercontent.com/91242806/212250586-728e180a-fd2b-4581-b282-67c0f684c022.png)

---

### ✨ 서비스 핵심 기능 소개
<details>
    <summary>1. 테스트하고, 나만의 젤리 만들기</summary>
    <div markdown="1">
        <blockquote>본인의 성향과 관심사 정보를 선택하시면, 15가지 캐릭터 중 본인에게 가장 잘 어울리는 캐릭터를 발급해드립니다.</blockquote>
        <img width="100%" alt="image" src="https://user-images.githubusercontent.com/91242806/212250651-0b63e920-db75-4b50-aa01-5d7d76a2961a.png">
    </div>
</details>

<details>
    <summary>2. 나에게 꼭 맞는 추천 게시물 보기</summary>
    <div markdown="1">
        <blockquote>앞서 발급된 캐릭터의 성격에 맞춰 추천 탭에서 보여지는 정보가 달라져, 본인에게 알맞는 정보를 상단에서 확인하실 수 있습니다.</blockquote>
        <img width="100%" alt="image" src="https://user-images.githubusercontent.com/91242806/212250689-134bb577-6c41-45f0-9a01-2c87c64b7dad.png">
    </div>
</details>
    
<details>
    <summary>3. ID 카드 발급받기</summary>
    <div markdown="1">
        <blockquote>학생증과 청소년증을 스캔하여 본인을 인증하고, 인증된 정보로 키니즈만의 ID 카드를 발급받으실 수 있습니다.</blockquote>
        <img width="100%" alt="image" src="https://user-images.githubusercontent.com/91242806/212250801-49f3e9e3-0317-4d0e-8471-fb0357c3cd86.png">
        <img width="100%" alt="image" src="https://user-images.githubusercontent.com/91242806/212250901-54a0cf2d-2e3c-485c-8095-0b053c797fbe.png">
    </div>
</details>

---

### 🧾 API 명세서 <a href="https://tourmaline-hare-a67.notion.site/13adb25a5eee4d28b7d5affae6ce0e08?v=0ec906cdd52d497d861f469c25bd706a">확인하기</a>

### 👣 ERD
<img width="100%" alt="image" src="https://user-images.githubusercontent.com/91242806/212251651-04791fa4-ff9d-43a8-8c7e-02c7d0a61302.png">


### 🛠 Tech

<div>
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">
</div>

---

### 🫧 Convention

<details>
<summary>Code convention</summary>
<div markdown="1">

- 변수나 함수명은 `camelCase`

- 함수의 경우 동사 + 명사
    - ex) getInformation()
    
- DB 테이블 이름 `PascalCase` / 칼럼(column) 이름은 `snake_case`

- Class / Interface / Type / Namespace / Enum 명은 `PascalCase`

- 약어는 되도록 사용하지 않는다. (필요한 경우 팀원과의 논의 하에 사용)

- 파일명은 `camelCase` ex) userController.ts, userService.ts, userRouter.ts

</div>
</details>

<details>
<summary>Commit message convention</summary>
<div markdown="1">


| 태그 이름  | 설명                                                                 |
| ---------- | -------------------------------------------------------------------- |
| [feat]     | 새로운 기능 구현                                                     |
| [update]     | 추가 개발 진행                                     |
| [merge]    | 다른 브랜치를 merge 할 때 사용                                       |
| [fix]      | 버그, 오류 수정                                                      |
| [remove]      | 불필요한 코드 삭제                                                   |
| [rename]   | 파일 이름 변경 시 사용                                               |


</div>
</details>


<details>
<summary>Git Branch convention</summary>
<div markdown="1">

- main : 개발 브랜치

- master : 배포 브랜치

- feat/user → router 별로 분리

</div>
</details>

---

### 📂 Directory Structure

```
./src
├── index.ts
├── constants
│   ├── index.ts
│   ├── response.ts
│   ├── responseMessage.ts
│   ├── statusCode.ts
│   └── tokenType.ts
├── controller
│   ├── userController.ts
│   ├── userController.test.ts
│   ├── index.ts
│   ├── contentController.test.ts
│   └── contentController.ts
├── data
│   └── character.json
├── interfaces
│   ├── user
│   │   ├── CharacterCreateDTO.ts
│   │   ├── CharacterResDTO.ts
│   │   ├── CheckIdentityDTO.ts
│   │   ├── UserCreateDTO.ts
│   │   └── UserUpdateDTO.ts
│   └── content
│       ├── AllContentsDTO.ts
│       └── ContentDTO.ts
├── middlewares
│   ├── auth.ts
│   └── index.ts
├── modules
│   └── jwtHandler.ts
├── router
│   ├── userRouter.ts
│   ├── index.ts
│   └── contentRouter.ts
└── service
    ├── userService.ts
    ├── index.ts
    └── conentService.ts

```

### 🗞 Dependencies Module ( package.json )

```json
{
  "name": "seminar4",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc && node dist",
    "db:pull": "npx prisma db pull && npx prisma generate",
    "db:push": "npx prisma db push && npx prisma generate",
    "generate": "npx prisma generate",
    "prepare": "husky install",
    "test": "dotenv -e prisma/.env.test npx prisma db push && npx prisma generate && jest --detectOpenHandles --forceExit "
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/express": "^4.17.14",
    "@types/express-validator": "^3.0.0",
    "@types/jest": "^29.2.5",
    "@types/jsonwebtoken": "^8.5.9",
    "@types/multer": "^1.4.7",
    "@types/multer-s3": "^3.0.0",
    "@types/node": "^18.11.9",
    "@types/supertest": "^2.0.12",
    "husky": "^8.0.3",
    "jest": "^29.3.1",
    "nodemon": "^2.0.20",
    "supertest": "^6.3.3",
    "ts-jest": "^29.0.3",
    "typescript": "^4.9.4"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.216.0",
    "@prisma/client": "^4.5.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3",
    "dotenv-cli": "^6.0.0",
    "express": "^4.18.2",
    "express-validator": "^6.14.2",
    "jsonwebtoken": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "multer-s3": "^3.0.1",
    "prisma": "^4.5.0"
  },
  "jest": {
    "transform": {
      "^.+\\.ts$": "ts-jest"
    },
    "testRegex": "\\.test\\.ts$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "json"
    ]
  }
}

```

### Server Architecture
![image](https://user-images.githubusercontent.com/91242806/212323115-12b91514-fdbe-4ef3-aa48-5e6785770935.png)


---

### 역할 분배

<table>
    <tr align="center">
        <td>
           박서원
        </td>
        <td>
           user Router API 구현
        </td>
    </tr>
    <tr align="center">
        <td>
           김규원
        </td>
        <td>
           content Router API 구현
        </td>
    </tr>
</table>
