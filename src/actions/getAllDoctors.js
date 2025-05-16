import { db } from "@/lib/database";

async function getAllDoctors() {
    try {
        const response = await db.user.findMany({
            where: {
                role: "DOCTOR",
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getAllDoctors;