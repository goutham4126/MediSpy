"use server";

import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

async function DeleteUser(id)
{
    const user=await checkUser();
    if(!user)
    {
        return null;
    }
    try{
       await db.user.deleteMany({where:{id:id}});
    }
    catch(error)
    {
        return {error:"Error finding doctors"};
    }
}

export default DeleteUser;