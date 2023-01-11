# Keyneez-Server

<img width="1129" alt="image" src="https://user-images.githubusercontent.com/91242806/211756405-0a7e0eff-36cf-476d-add7-3b806b6c4791.png">

---

### ✨ 서비스 핵심 기능 소개
<details>
    <summary>1. 해시태그에 따른 맞춤형 캐릭터 생성</summary>
    <div markdown="1">
        <blockquote>본인의 성향과 관심사 정보를 선택하시면, 15가지 캐릭터 중 본인에게 가장 잘 어울리는 캐릭터를 발급해드립니다.</blockquote>
        <img width="753" alt="image" src="https://user-images.githubusercontent.com/91242806/211747781-1acfd5f9-d00f-473b-b1d3-08914d60a49e.png">
    </div>
</details>

<details>
    <summary>2. 유저의 성향에 따른 정보 추천</summary>
    <div markdown="1">
        <blockquote>앞서 발급된 캐릭터의 성격에 맞춰 추천 탭에서 보여지는 정보가 달라져, 본인에게 알맞는 정보를 상단에서 확인하실 수 있습니다.</blockquote>
        <img width="483" alt="image" src="https://user-images.githubusercontent.com/91242806/211748008-e7e78f55-9f18-4d75-97f9-0590b5dbd2bd.png">
    </div>
</details>
    
<details>
    <summary>3. OCR 기능을 활용한 학생증 / 청소년증 기반 ID 카드 발급</summary>
    <div markdown="1">
        <blockquote>학생증과 청소년증을 스캔하여 본인을 인증하고, 인증된 정보로 키니즈만의 ID 카드를 발급받으실 수 있습니다.</blockquote>
        <img width="865" alt="image" src="https://user-images.githubusercontent.com/91242806/211748351-82f29996-0422-4364-9c1b-828e7fe22f7c.png">
    </div>
</details>

---

### 🧾 API 명세서 <a href="https://tourmaline-hare-a67.notion.site/13adb25a5eee4d28b7d5affae6ce0e08?v=0ec906cdd52d497d861f469c25bd706a">확인하기</a>

### 👣 ERD
<img width="1047" alt="image" src="https://user-images.githubusercontent.com/91242806/211757028-f44b7740-83c7-456d-9bfc-a2d01fcf3530.png">


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
│   ├── index.ts
│   └── contentController.ts
├── data
│   └── character.json
├── interfaces
│   ├── user
│   │   ├── CharacterCreateDTO.ts
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
    "generate": "npx prisma generate"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/express": "^4.17.14",
    "@types/express-validator": "^3.0.0",
    "@types/jsonwebtoken": "^8.5.9",
    "@types/multer": "^1.4.7",
    "@types/multer-s3": "^3.0.0",
    "@types/node": "^18.11.9",
    "nodemon": "^2.0.20"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.216.0",
    "@prisma/client": "^4.5.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^6.14.2",
    "jsonwebtoken": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "multer-s3": "^3.0.1",
    "prisma": "^4.5.0"
  }
}

```

### Server Architecture
![server architecture](https://user-images.githubusercontent.com/91242806/211798651-33777287-42eb-4586-9e10-85b788de24e0.jpg)
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
