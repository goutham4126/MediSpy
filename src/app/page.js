import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import { checkUser } from "@/lib/auth";
import getPatientConsultations from "@/actions/getPatientConsultations";
import getDoctorConsultations from "@/actions/getDoctorConsultations";
import getAllConsultations from "@/actions/getAllConsultations";
import getAllDoctors from "@/actions/getAllDoctors";
import getAllPatients from "@/actions/getAllPatients";

export default async function Home() {
  const user = await checkUser();
  if(!user)
    return null;
  const consultations = await getAllConsultations();
  const doctors = await getAllDoctors();
  const patientConsultations = await getPatientConsultations();
  const doctorConsultations = await getDoctorConsultations();
  const patients=await getAllPatients();
  return (
    <div>
        {
          user.role === "ADMIN" ? (
            <AdminDashboard doctors={doctors} consultations={consultations} patients={patients}/>
          ) : user.role === "DOCTOR" ? (
            <DoctorDashboard consultations={doctorConsultations} user={user}/>
          ) : (
            <PatientDashboard doctors={doctors} consultations={patientConsultations}/>
          )
        }
    </div>
  );
}
