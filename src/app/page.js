import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import { checkUser } from "@/lib/auth";
import getPatientConsultations from "@/actions/getPatientConsultations";
import getDoctorConsultations from "@/actions/getDoctorConsultations";
import getAllConsultations from "@/actions/getAllConsultations";
import getAllDoctors from "@/actions/getAllDoctors";

export default async function Home() {
  const user = await checkUser();
  const consultations = await getAllConsultations();
  const doctors = await getAllDoctors();
  const patientConsultations = await getPatientConsultations();
  const doctorConsultations = await getDoctorConsultations();

  return (
    <div>
        {
          user.role === "ADMIN" ? (
            <AdminDashboard doctors={doctors} consultations={consultations}/>
          ) : user.role === "DOCTOR" ? (
            <DoctorDashboard doctors={doctors} consultations={doctorConsultations}/>
          ) : (
            <PatientDashboard doctors={doctors} consultations={patientConsultations}/>
          )
        }
    </div>
  );
}
