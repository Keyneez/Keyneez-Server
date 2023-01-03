import { PrismaClient } from "@prisma/client";
import { AllContentsDto } from "../interfaces/AllContentsDTO";

const prisma = new PrismaClient();

//* 컨텐츠 전체 조회 - 사용자의 좋아요 여부 포함
const getAllContent = async (user_key: number) => {
  const data: AllContentsDto[] =
    await prisma.$queryRawUnsafe(`select A.content_key, A.content_title, A.introduction, A.start_at, A.end_at, D.category_name as category,
    case when b.liked_key is not null
        then true
        else false
 end as liked
from "Contents" A
left join "Liked" B
on (A.content_key = B.content) and (B.user = ${user_key})
left join "ContentMapping" C
on A.content_key = C.content
left join "ContentCategory" D
on C.category = D.category_key;
`);
  return data;
};

const contentService = { getAllContent };

export default contentService;
