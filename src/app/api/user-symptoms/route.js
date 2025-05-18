import getUserSymptoms from "@/actions/getUserSymptoms";

export async function GET(_req) {
    try {
            const symptoms = await getUserSymptoms();
            return new Response(JSON.stringify(symptoms), { status: 200 });
    } catch (error) {
        return new Response(
        JSON.stringify({ error: "Failed to fetch user symptoms" }),
        { status: 500 }
        );
    }
}
