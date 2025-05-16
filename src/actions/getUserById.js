import { db } from "@/lib/database";

async function getUserById({ id }) {
    if (!id) {
        throw new Error("ID is required");
    }
    try {
        const response = await db.user.findUnique({
            where: {
                id: id,
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getUserById;