import Razorpay from '@/components/Razorpay';
import { checkUser } from '@/lib/auth';
export default async function Home() {
  const user = await checkUser();
  return (
    <main>
      <Razorpay user={user}/>
    </main>
  );
}