import SymptomChecker from "@/components/SymptomChecker"
import getSubscription from "@/actions/getSubscription";
async function page() {
  const subscription = await getSubscription();
  return (
    <div>
      <SymptomChecker subscription={subscription}/>
    </div>
  )
}

export default page;