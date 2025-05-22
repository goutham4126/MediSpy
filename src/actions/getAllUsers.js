import { db } from "@/lib/database";

async function getAllUsers() {
    try {
        const response = await db.user.findMany({});
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getAllUsers;