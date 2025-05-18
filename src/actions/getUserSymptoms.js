"use server";
import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

export default async function getUserSymptoms() {
    const user = await checkUser();
    if (!user) {
        return null;
    }
    try {
        const symptoms = await db.symptom.findMany({
            where: {
                patientId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },  
        });
        return symptoms;
    } catch (error) {
        console.log(error);
        throw error;
    }
}