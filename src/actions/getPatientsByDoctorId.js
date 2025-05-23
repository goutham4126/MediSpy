import { db } from "@/lib/database";

async function getPatientsByDoctorId(id) {
    try {
        const response = await db.consultation.findMany({
            where: {
                doctorId: id
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getPatientsByDoctorId;