"use server";

import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

async function AddConsultation({data})
{
    const user=await checkUser();
    if(!user)
    {
        return null;
    }
    try{
        const { diagnosis,age, gender, patientPhoneNo, date,stage,doctorId } = data;
        const ageInt = parseInt(age, 10);
        const dateTime = new Date(date);
        const consultation= await db.consultation.create({
            data:{
                doctorId: doctorId, 
                patientId:user.id,
                diagnosis: diagnosis,
                prescription: "",
                gender:gender,
                age:ageInt,
                patientPhoneNo: patientPhoneNo,
                date: dateTime,
                status:"PENDING",
                stage:stage
            }
        })
        return consultation;
    }
    catch(error)
    {
        return {error:"Error finding doctors"};
    }
}

export default AddConsultation;