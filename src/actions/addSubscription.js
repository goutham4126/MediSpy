"use server";

import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

async function AddSubscription(amount)
{
    const user=await checkUser();
    if(!user)
    {
        return null;
    }
    if(amount===99)
    {
        var plan="BASIC";
    }
    else if(amount===149)
    {
        var plan="PREMIUM";
    }

    try{
        const consultation= await db.subscription.create({
            data:{
                userId:user.id,
                plan:plan,
            }
        })
        return consultation;
    }
    catch(error)
    {
        return {error:"Error finding doctors"};
    }
}

export default AddSubscription;