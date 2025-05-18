"use server";

import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

async function AddSymptoms({description, possibleDisease, riskFactor})
{
    const user=await checkUser();
    if(!user)
    {
        return null;
    }

    try{
        const symptom= await db.symptom.create({
            data:{
                patientId:user.id,
                description:description,
                possibleDisease:possibleDisease,
                riskFactor:riskFactor
            }
        })
        return symptom;
    }
    catch(error)
    {
        return {error:"Error creating symptom"};
    }
}

export default AddSymptoms;