import { PrismaClient } from "@prisma/client";
import { AllContentsDto } from "../interfaces/AllContentsDTO";

const prisma = new PrismaClient();

//* 컨텐츠 전체 조회 - 사용자의 좋아요 여부 포함
const getAllContent = async (user_key: number) => {
  const user = await prisma.user.findUnique({
    where: {
      user_key: user_key,
    },
  });
  const { user_character }: number = user;

  const { inter } :string = await prisma.characters.findUnique({
    where: {
      character_key: user_character,
    },
  });

  const data: AllContentsDto[] = await prisma.$queryRawUnsafe(
    `select content_key, content_title, introduction, start_at, end_at, category, liked
    from (select *, case
    when temp.interest = '${inter}'
    then 0
    else 1
    end as priority
    from (select content_key, content_title, introduction, start_at, end_at, category, unnest(T.interest) as interest, liked from (select A.content_key, A.content_title, A.introduction, A.start_at, A.end_at,
                      array_agg(D.category_name) as category,
                      coalesce(array_agg(D.inter) Filter ( Where D.inter != '혜택' ), null) as interest,
            case
                when b.liked_key is not null
                then true
                else false
            end as liked,
            rank() over (Partition By coalesce(array_agg(D.inter) Filter ( Where D.inter != '혜택' ), null) ORDER BY content_key ASC) as a

        from "Contents" A
        left join "Liked" B
        on (A.content_key = B.content) and (B.user = ${user_key})
        left join "ContentMapping" C
        on A.content_key = C.content
        left join "ContentCategory" D
        on C.category = D.category_key
        group by A.content_key, b.liked_key) as T
    where T.a <= 3) as temp) as result
    order by priority ASC
    ;`
  );

  return data;
};

const contentService = { getAllContent };

export default contentService;
