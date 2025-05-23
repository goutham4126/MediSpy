
import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

async function getPatientConsultations() {
    const user = await checkUser();
    if (!user) {
        return null;
    }

    try {
        const response = await db.consultation.findMany({
            where: { patientId: user.id },
            include: {
                doctor: true,
            },
            orderBy: { date: "desc" },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getPatientConsultations;