import { checkUser } from "@/lib/auth"
import { AdminSidebar } from "./admin-sidebar";
import { DoctorSidebar } from "./doctor-sidebar";
import { PatientSidebar } from "./patient-sidebar";

async function AppSidebar() {
  const user = await checkUser();
  return (
    <div>
        {
            user?.role === "ADMIN" && <AdminSidebar/>
        }
        {
            user?.role === "DOCTOR" && <DoctorSidebar/>
        }
        {
            user?.role === "PATIENT" && <PatientSidebar/>
        }
    </div>
  )
}

export default AppSidebar;