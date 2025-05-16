import DoctorDetails from "@/components/DoctorDetails";
import getUserById from "@/actions/getUserById";

export default async function DoctorPage({ params }) {
  const {id} = await params;
  const user = await getUserById({ id });

  if (!user) {
    return <div>Doctor not found</div>;
  }

  return (
    <div>
      <DoctorDetails user={user} />
    </div>
  );
}