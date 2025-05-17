import EditProfileForm from "@/components/EditProfileForm";
import { checkUser } from "@/lib/auth";

export default async function page() {
  const user = await checkUser();

  return <EditProfileForm user={user} />;
}