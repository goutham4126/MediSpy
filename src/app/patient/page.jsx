import getAllDoctors from "@/actions/getAllDoctors"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import getPatientConsultations from "@/actions/getPatientConsultations"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

async function page() {
  const doctors = await getAllDoctors()
  const patientConsultations = await getPatientConsultations()

  return (
    <div className="space-y-8 p-2">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Doctors Directory</h1>
        <p className="text-sm text-muted-foreground">
          Browse and connect with our specialist doctors
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <Link key={doctor.id} href={`/doctor/${doctor.id}`}>
            <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-200 rounded-lg overflow-hidden">
              <CardHeader className="flex items-center gap-4 pb-2">
                <img
                  src={doctor?.imageUrl}
                  alt={doctor?.name}
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
                    Available
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <Separator className="my-6 bg-gray-200" />
      
      <div className="space-y-4 bg-white">
        <div className="pb-2">
          <h2 className="text-2xl font-bold text-gray-900">My Consultations</h2>
          <p className="text-sm text-muted-foreground">
            A list of your recent consultations
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Doctor
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Patient
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Diagnosis
                </TableHead>
                <TableHead className="font-medium text-gray-700 text-right px-4 py-3">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientConsultations.map((consultation) => (
                <TableRow 
                  key={consultation.id} 
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="font-medium border-r border-gray-200 px-4 py-3">
                    {consultation.doctorId}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {consultation.patientId}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {consultation.diagnosis || "Not specified"}
                  </TableCell>
                  <TableCell className="text-right px-4 py-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      consultation.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : consultation.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {consultation.status}
                    </span>
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