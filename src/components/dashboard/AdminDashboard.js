import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminMetrics } from "@/components/AdminMetrics";
import getAllUsers from "@/actions/getAllUsers";
import getAllConsultations from "@/actions/getAllConsultations";
import {
  Table,  
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteUserButton from "../DeleteUserButton";
import EditUserRoleButton from "../EditUserRoleButton";
import { Component } from "../charts/BarChart";


export default async function AdminDashboard({ doctors, consultations,patients }) {
  const users = await getAllUsers();
  const allConsultations = await getAllConsultations();
  
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
            <CardDescription>Total no of Consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-600">{consultations.length}</p>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>Total no of Doctors available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-blue-600">{doctors.length}</p>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Total no of Users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-purple-600">{users.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="my-4">
        <Component consultations={allConsultations} />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <AdminMetrics doctors={doctors} consultations={consultations} patients={patients}/>
        </div>
      </div>
      <div className="space-y-4 bg-white">
        <div className="pb-2">
          <h2 className="text-2xl font-bold text-gray-900">All Consultations</h2>
          <p className="text-sm text-muted-foreground">
            A list of all user consultations
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-md overflow-hidden mb-5">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Consultation ID
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Doctor
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Date
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
              {allConsultations.map((consultation) => (
                <TableRow 
                  key={consultation.id} 
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="font-medium border-r border-gray-200 px-4 py-3">
                    {consultation.id}
                  </TableCell>
                  <TableCell className="font-medium border-r border-gray-200 px-4 py-3">
                    {doctors.find(d => d.id === consultation.doctorId)?.name || consultation.doctorId}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {new Date(consultation.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
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
      
      <div className="space-y-4 bg-white">
        <div className="pb-2">
          <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          <p className="text-sm text-muted-foreground">
            A list of all registered users
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-md overflow-hidden mb-5">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  User ID
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Name
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Email
                </TableHead>
                <TableHead className="font-medium text-gray-700 border-r border-gray-200 px-4 py-3">
                  Role
                </TableHead>
                <TableHead className="font-medium text-gray-700 px-4 py-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="font-medium border-r border-gray-200 px-4 py-3">
                    {user.id.slice(0, 16) + '...'}
                  </TableCell>
                  <TableCell className="font-medium border-r border-gray-200 px-4 py-3">
                    {user.name}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {user.email}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-4 py-3">
                    {user.role}
                  </TableCell>
                  <TableCell className="px-4 py-3 space-y-2">
                    {user.role === "ADMIN" ? (
                      <p className="font-semibold text-sm text-center">Owner</p>
                    ) : (
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <EditUserRoleButton userId={user.id} currentRole={user.role} />
                        <DeleteUserButton userId={user.id} />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}