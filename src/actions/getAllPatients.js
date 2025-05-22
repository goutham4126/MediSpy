import { db } from "@/lib/database";

async function getAllPatients() {
    try {
        const response = await db.user.findMany({
            where: {
                role: "PATIENT",
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getAllPatients;