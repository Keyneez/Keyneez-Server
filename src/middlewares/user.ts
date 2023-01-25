import { CharacterCreateDTO } from './../interfaces/user/CharacterCreateDTO';
import { Characters, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkItem = async (character : Characters | null, characterCreateDTO : CharacterCreateDTO) => {

    let isItem = false;

    const getItem = await prisma.items.findMany({
        where: {
            item_inter: character?.inter
        },
        select: {
            items_key: true,
        }
    })
    
    const getUserItem = await prisma.userItem.findMany({
        where: {
            user: characterCreateDTO.user_key,
        }
    })

    const getedItem = getItem.map(item => {
        return item.items_key
    })

    const UserItem = getUserItem.map(item => {
        return item.item
    })

    getedItem.forEach(item => {
        if (UserItem.includes(item)){
            isItem = true;
        }
    })

    const returnItem = {
        isItem,
        getedItem,
    }
    return returnItem;
}

const userMid = {
    checkItem,
}

export default userMid;