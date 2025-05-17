import { db } from "@/lib/database";

async function getAllConsultations() {
    try {
        const response = await db.consultation.findMany({});
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getAllConsultations;