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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, PlusCircle, AlertCircle } from 'lucide-react'
import AddSymptoms from '@/actions/addSymptoms'
import toast from 'react-hot-toast'

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [predictions, setPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userDetails, setUserDetails] = useState({
    disease: '',
    age: '',
    gender: 'prefer-not-to-say',
    duration: '',
    severity: 'moderate'
  })

  const [recentSymptoms, setRecentSymptoms] = useState([])

    useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/user-symptoms')
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        const data = await response.json()
        setRecentSymptoms(data)
      } catch (error) {
        console.error('Error fetching symptoms:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSymptoms() 
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if(recentSymptoms.length>=3)
      {
        toast.error('You can only analyze up to 3 symptoms per month.')
        return; 
      }
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const data = await response.json()
      if (data.success) {
        setPredictions(data.predictions)
        setUserDetails(prev => ({
          ...prev,
          disease: data.predictions[0].disease
        }))

        // Here comes the logic to save the symptoms and predictions to the database
        const addsymptoms = await AddSymptoms({
          description: symptoms,
          possibleDisease: data.predictions[0].disease,
          riskFactor: "30"
        })
        if (addsymptoms.error) {
          toast.error('Error saving symptoms to the database')
          return;
        }
        toast.success('Symptoms analyzed successfully')
      } else {
        throw new Error(data.error || 'Failed to analyze symptoms')
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze symptoms. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="-my-28"><Loading /></div>
  if (error) return <div>Error: {error}</div>

  const handleDetailChange = (field, value) => {
    setUserDetails(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="mx-auto md:p-4 space-y-10 min-h-screen">
      <Card className="border border-border bg-background shadow-xl dark:shadow-blue-900/20 rounded-2xl transition-colors">
        <CardContent className="p-6 md:p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <Label htmlFor="symptoms" className="text-base font-semibold flex items-center space-x-2">
                <PlusCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Describe your symptoms</span>
              </Label>
              <Textarea
                id="symptoms"
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., throbbing headache, nausea, light sensitivity..."
                className="min-h-[150px] text-base bg-muted dark:bg-muted/40 border border-border"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center font-semibold">
                  Analyze Symptoms <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-lg text-sm">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {predictions.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Possible Conditions
                </h2>
                <p className="text-muted-foreground text-sm">Select the one that matches your symptoms best</p>
              </div>

              <div className="grid gap-4">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl transition-all border cursor-pointer ${
                      userDetails.disease === prediction.disease
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow'
                        : 'border-border bg-card hover:border-blue-400'
                    }`}
                    onClick={() => handleDetailChange('disease', prediction.disease)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${
                          userDetails.disease === prediction.disease ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-500'
                        }`} />
                        <span className="font-medium text-foreground">{prediction.disease}</span>
                      </div>
                      <div className="flex items-center">
                        <Progress
                          value={prediction.confidence * 100}
                          className="h-2 w-24 mr-3"
                          indicatorcolor={
                            prediction.confidence > 0.7 ? 'bg-green-500' :
                            prediction.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                          }
                        />
                        <Badge
                          variant={
                            prediction.confidence > 0.7 ? 'default' :
                            prediction.confidence > 0.4 ? 'secondary' : 'destructive'
                          }
                          className="px-2 py-0.5"
                        >
                          {(prediction.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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
                {recentSymptoms.length > 0 ? (
                  recentSymptoms.map((symptom) => (
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
    </div>
  )
}
