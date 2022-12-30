# Keyneez-Server

### 서비스 한줄 소개

### BASE URL : 

### API
명세서: <a href="">확인하기</a>

### 기술 스택

<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">
 <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">

### Code convention

- 변수나 함수명은 `camelCase`
- 함수의 경우 동사 + 명사
    - ex) getInformation()
- DB 테이블 이름 `PascalCase` / 칼럼(column) 이름은 `snake_case`
- Class / Interface / Type / Namespace / Enum 명은 `PascalCase`
- 약어는 되도록 사용하지 않는다. (필요한 경우 팀원과의 논의 하에 사용)
- 파일명은 `camelCase` ex) userController.ts, userService.ts, userRouter.ts

### Commit message convention

| 태그 이름  | 설명                                                                 |
| ---------- | -------------------------------------------------------------------- |
| [feat]     | 새로운 기능 구현                                                     |
| [update]     | 추가 개발 진행                                     |
| [merge]    | 다른 브랜치를 merge 할 때 사용                                       |
| [fix]      | 버그, 오류 수정                                                      |
| [remove]      | 불필요한 코드 삭제                                                   |
| [rename]   | 파일 이름 변경 시 사용                                               |

### Git Branch convention

- main : 개발 브랜치
- master : 배포 브랜치
- feat/user → router 별로 분리

### Directory Structure

```
./src
├── controller
│   ├── friendController.ts
│   ├── index.ts
│   └── recordController.ts
├── index.ts
├── interfaces
│   ├── RecordDTO.ts
│   ├── friendDTO.ts
│   └── friendListDTO.ts
├── router
│   ├── friendRouter.ts
│   ├── index.ts
│   └── recordRouter.ts
└── service
    ├── friendService.ts
    ├── index.ts
    └── recordService.ts

```

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

### ERD


### Server Architecture
![KakaoTalk_Photo_2022-11-20-06-25-03](https://user-images.githubusercontent.com/67372977/202872172-fa636121-a6d7-4e79-83fd-40dbe8407b93.png)
