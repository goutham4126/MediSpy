import getAvailableDoctors from "@/actions/getAvailableDoctors"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image";
import { Separator } from "@/components/ui/separator"
import { FaRegAddressBook } from "react-icons/fa";
import getDoctorConsultations from "@/actions/getDoctorConsultations"
import { UpdateStatusSelect } from "@/components/UpdateStatusSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { checkUser } from "@/lib/auth";
import { EditPrescription } from "@/components/EditPrescription";
import { VideoUrl } from "@/components/VideoUrl";


async function page() {
  const user = await checkUser();
  const doctors = await getAvailableDoctors();
  const doctorConsultations = await getDoctorConsultations()

  return (
    <div className="space-y-8 p-2">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Doctors Directory</h1>
        <p className="text-sm text-muted-foreground">
          Browse and connect with our specialist doctors
        </p>
      </div>
      {
        doctors.length===0 && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900">No Doctors Available</h1>
          </div>
        )
      }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <Link key={doctor.id} href={`/doctor/${doctor.id}`}>
            <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-200 rounded-lg overflow-hidden">
              <CardHeader className="flex items-center gap-4 pb-2">
                <Image
                  src={doctor?.imageUrl}
                  alt={doctor?.name}
                  width={100}
                  height={100}
                  className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="space-y-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {doctor.doctorSpecialization}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {doctor.doctorExperience} years experience
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {doctor.doctorAvailability ? "Available" : "Unavailable"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* His patients */}
      
      <Separator className="my-6 bg-gray-200" />
      
      <div className="space-y-4 bg-white">
        <div className="pb-2">
          <h2 className="text-2xl font-bold text-gray-900">Patient Consultations</h2>
          <p className="text-sm text-muted-foreground">
            All your patients consultations are listed here
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-md overflow-hidden mb-5">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Patient
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Date
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Diagnosis
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Prescription
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Video url
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Status
                </TableHead>
                <TableHead className="font-medium text-gray-700 px-4 py-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorConsultations.map((consultation) => (
                <TableRow 
                  key={consultation.id} 
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {consultation?.patientId}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {consultation.date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {consultation.diagnosis || "Not specified"}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    <Dialog>
                      <DialogTrigger asChild className="flex items-center justify-center w-full">
                        <FaRegAddressBook className="cursor-pointer h-6 w-6"/>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Strictly follow the prescription</DialogTitle>
                        </DialogHeader>
                          <EditPrescription 
                            initialValue={consultation.prescription || "Not specified"}
                            consultationId={consultation.id}
                            role={user?.role}
                          />
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Join</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Join link</DialogTitle>
                          <DialogDescription>
                            Copy the link below and join the consultation
                          </DialogDescription>
                        </DialogHeader>
                        <VideoUrl 
                            initialValue={consultation.videoUrl || "Not specified"}
                            consultationId={consultation.id}
                            role={user?.role}
                          />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {consultation.status}
                  </TableCell>
                  <TableCell className="text-right">
                    <UpdateStatusSelect
                      consultationId={consultation.id}
                      initialStatus={consultation.status}
                    />
                  </TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>  
    </div>
  )
}

export default page;