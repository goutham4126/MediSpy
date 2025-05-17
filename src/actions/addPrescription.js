"use server";

import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

async function EditConsultation({prescription},id)
{
    const user=await checkUser();
    if(!user)
    {
        return null;
    }
    try{
        const consultation= await db.consultation.update({
            data:{
                prescription: prescription,
            },
            where:{
                id:id,
            }
        })
        return consultation;
    }
    catch(error)
    {
        return {error:"Error finding doctors"};
    }
}

export default EditConsultation;