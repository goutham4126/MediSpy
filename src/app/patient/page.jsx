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
import { FaRegAddressBook } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import getPatientConsultations from "@/actions/getPatientConsultations"
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { checkUser } from "@/lib/auth";
import CopyText from "@/components/CopyText";


async function page() {
  const user = await checkUser();
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
        
        <div className="border border-gray-200 rounded-md overflow-hidden mb-5">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Doctor
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
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            {
                              user?.role === "PATIENT" && (
                                <Textarea
                                  id="prescription"
                                  defaultValue={consultation.prescription || "Not specified"}
                                  readOnly
                                />
                              )
                            }
                            {
                              user?.role === "DOCTOR" && (
                                <Textarea
                                  id="prescription"
                                  defaultValue={consultation.prescription || "Not specified"}
                                />
                              )
                            }
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
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
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                              Link
                            </Label>
                            <Input
                              id="link"
                              defaultValue={consultation.videoUrl || "Not specified"}
                              readOnly
                            />
                          </div>
                          <CopyText text={consultation.videoUrl || "Not specified"} />
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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