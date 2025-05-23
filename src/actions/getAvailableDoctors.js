import { db } from "@/lib/database";

async function getAvailableDoctors() {
    try {
        const response = await db.user.findMany({
            where: {
                role: "DOCTOR",
                doctorAvailability: true,
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getAvailableDoctors;