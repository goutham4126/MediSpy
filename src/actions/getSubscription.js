import { db } from "@/lib/database";
import { checkUser } from "@/lib/auth";
async function getSubscription() {
    const user = await checkUser();
    if (!user) {
        return null;
    }
    try {
        const response = await db.subscription.findFirst({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export default getSubscription;