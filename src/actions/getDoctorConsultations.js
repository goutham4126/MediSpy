
import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";

async function getDoctorConsultations() {
    const user = await checkUser();
    if (!user) {
        return null;
    }
    
    try {
        const response = await db.consultation.findMany({
            where: { doctorId: user.id },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getDoctorConsultations;