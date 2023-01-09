import { ContentDTO } from './../interfaces/content/ContentDTO';
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import { AllContentsDto } from "../interfaces/content/AllContentsDTO";

const prisma = new PrismaClient();

//* 컨텐츠 전체 조회 - 사용자의 좋아요 여부 포함
const getAllContent = async (user_key: number) => {
  const userData = await prisma.user.findUnique({
    where: {
      user_key: user_key
    },
    include: {
      Characters: {
        select: {
          inter: true
        }
      }
    }
  })
  
  const userInterest = userData!.Characters!.inter;

  const data = await prisma.contents.findMany({
    include: {
      Liked: {
        where: {
          user: user_key,
        },
        select: {
          user: true,
        }
      },
      ContentMapping: {
        select: {
          ContentCategory: {
            select: {
              category_name: true,
              inter: true,
              }
            }
          }
      },
    }
  })

  const priorityData: any[] = [] ;

  const categoryCount = [0, 0, 0, 0, 0];

  const isShown = (firstInterest: string) => {
    let idx: number = -1;

    if(firstInterest == "경제인"){
      idx = 0;
    }
    if(firstInterest == "문화인"){
      idx = 1;
    }
    if(firstInterest == "봉사자"){
      idx = 2;
    }
    if(firstInterest == "진로탐색러"){
      idx = 3;
    }
    if(firstInterest == "탐험가"){
      idx = 4;
    }
    categoryCount[idx] += 1; 
    
    if (categoryCount[idx] > 3) {
      return false;
    }

    return true;
  };

  const result = data.map((content) => {
    const category = content.ContentMapping.map((e) => e.ContentCategory.category_name)   // category = ["경제인", "문화인", "봉사자"] -> 대표 카테고리는 무조건 처음으로 오는 카테고리
    const firstInterest = content.ContentMapping[0].ContentCategory.inter; // 대표 관심사 ex) 경제인
  
    const flag = isShown(firstInterest);

    if(!flag) return; // false 이면 null 반환
    
    let liked = true;
    if(content.Liked.length == 0) {
      liked = false;
    }

    const { content_img, content_link, place, benefit, Liked, ContentMapping, ...rest } = content;

    const result = {...rest, liked, category};

    if(firstInterest === userInterest) {
      priorityData.push(result); // 우선 순위 수집
      return;
    }

    return result;
  })  
  
  const unorderedData = result.filter(Boolean); // null 값은 제외
  const final = [...priorityData, ...unorderedData]
  // console.log(final.length);
  return final;
};


//* 컨텐츠 상세 조회
const getOneContent = async (user_key: number, content_id: number) => {
  const data: any = await prisma.contents.findUnique({
    where: {
      content_key: content_id
    },
    include: {
      Liked: {
        where: {
          user: user_key,
        },
        select: {
          user: true,
        }
      },
      ContentMapping: {
        select: {
          ContentCategory: {
            select: {
              category_name: true,
            }
          }
        }
      }

    }
  })

  let liked = true;
  if(data!.Liked.length == 0) {
    liked = false;
  }

  const category = data.ContentMapping.map((e: any) => e.ContentCategory.category_name)
  const {Liked, ContentMapping, ...rest} = data;

  const result: ContentDTO = {
    ...rest,
    liked,
    category,
  }

  return result;
};

//* 컨텐츠 검색 - 검색 대상 (title, introduction, place)
const searchContent = async (keyword: string, user_key: number) => {
  const content = await prisma.contents.findMany({
    where:{
      OR: [{
          content_title: {
            contains: keyword,
          }
        },
        {
          introduction: {
            contains: keyword,
          }
        },
        {
          place: {
          contains: keyword,
        }
        }]
    },
    select: {
      content_key: true,
      content_title:  true,
      start_at: true,
      end_at: true,
      Liked: {
        where: {
          user: user_key,
        },
        select: {
          user: true,
        }
      }
    }
  })

  const final = content.map((elem) => {
    const liked: boolean = (elem.Liked.length != 0) ? true : false;
    const { Liked, ...rest } = elem;
    const result = {...rest, liked };
    return result;
  })

  return final;
};

const createLiked = async (user_key: number, content_id: number) => {
  const data = await prisma.liked.create({
    data: {
      user: user_key,
      content: content_id
    }
  })
  return data;
}

const checkDuplicatedLiked = async (user_key: number, content_id: number) => {
  const data = await prisma.liked.findFirst({
    where: {
      user: user_key,
      content: content_id
    }
  })
  if(data) return false;
  return true;
}

const getLiked = async (user_key: number) => {
  const data = await prisma.liked.findMany({
    where: {
      user: user_key,
    },
    select: {
      Contents: {
        select: {
          content_key: true,
          content_title: true,
          start_at: true,
          end_at: true,
        }
      }
    }
  })

  return data;
}


const contentService = { 
  getAllContent,
  getOneContent, 
  searchContent,
  createLiked,
  getLiked,
  checkDuplicatedLiked
};

export default contentService;
