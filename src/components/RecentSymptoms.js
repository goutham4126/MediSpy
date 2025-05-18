"use client"
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Loading from '@/app/loading'

function RecentSymptoms() {
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user-symptoms')
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        const data = await response.json()
        setSymptoms(data)
      } catch (error) {
        console.error('Error fetching symptoms:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSymptoms() 
  }, [])

  if (loading) return <div className="-my-28"><Loading /></div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Symptoms</h2>
      
      <Table className="border">
        <TableCaption>A list of your recent symptoms.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Possible Condition</TableHead>
            <TableHead>Risk Factor</TableHead>
            <TableHead>Reported Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {symptoms.length > 0 ? (
            symptoms.map((symptom) => (
              <TableRow key={symptom.id}>
                <TableCell>{symptom.description}</TableCell>
                <TableCell>{symptom.possibleDisease || '-'}</TableCell>
                <TableCell>{symptom.riskFactor || '-'}</TableCell>
                <TableCell>
                  {new Date(symptom.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No symptoms found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default RecentSymptoms