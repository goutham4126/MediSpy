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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function SymptomChecker({subscription}) {
  const [symptoms, setSymptoms] = useState('')
  const [predictions, setPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showMetricsForm, setShowMetricsForm] = useState(false)
  const [riskFactor, setRiskFactor] = useState(null)

  const [userDetails, setUserDetails] = useState({
    age: '',
    gender: 'prefer-not-to-say',
    duration: '',
    severity: 'moderate'
  })

  const [recentSymptoms, setRecentSymptoms] = useState([])
  
  const fetchUserSymptoms = async () => {
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

  useEffect(() => {
    fetchUserSymptoms()
  }, [])

  const calculateRiskFactor = (predictions, details) => {
    // Age factor
    const age = parseInt(details.age) || 30;
    let ageFactor = 0.5;
    if (age < 12) ageFactor = 0.7;
    else if (age > 65) ageFactor = 0.8;
    else if (age >= 30 && age <= 50) ageFactor = 0.4;

    // Duration factor
    const durationFactors = {
      'less than a day': 0.3,
      '1-3 days': 0.5,
      '4-7 days': 0.7,
      'more than a week': 0.9
    };
    const durationFactor = durationFactors[details.duration] || 0.5;

    // Severity factor
    const severityFactors = {
      'mild': 0.3,
      'moderate': 0.6,
      'severe': 0.9
    };
    const severityFactor = severityFactors[details.severity] || 0.5;

    // Calculate weighted risk
    let weightedRisk = 0;
    predictions.forEach(prediction => {
      const diseaseWeight = 0.5;
      weightedRisk += (diseaseWeight * prediction.confidence);
    });

    // Normalize and combine factors
    weightedRisk = Math.min(1, weightedRisk / predictions.length);
    const combinedRisk = (
      (weightedRisk * 0.5) + 
      (ageFactor * 0.2) + 
      (durationFactor * 0.15) + 
      (severityFactor * 0.15)
    );

    return Math.round(combinedRisk * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if(subscription===null && recentSymptoms.length >= 3) {
        toast.error('You can only analyze up to 3 symptoms per month. Take subscription for more.')
        return; 
      }

      if(subscription?.plan==="BASIC" && recentSymptoms.length >= 10) {
        toast.error('You can only analyze up to 10 symptoms per month. Take subscription for more.')
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
        setShowMetricsForm(true)
        toast.success('Symptoms analyzed. Please provide additional details.')
      } else {
        throw new Error(data.error || 'Failed to analyze symptoms')
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze symptoms. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMetricsSubmit = async () => {
    setIsLoading(true)
    try {
      const calculatedRisk = calculateRiskFactor(predictions, userDetails);
      setRiskFactor(calculatedRisk);

      // Save to database
      const addsymptoms = await AddSymptoms({
        description: symptoms,
        possibleDisease: predictions[0].disease,
        riskFactor: calculatedRisk.toString(),
      });
      
      if (addsymptoms.error) {
        toast.error('Error saving symptoms to the database');
        return;
      }
      
      toast.success('Risk assessment completed');
      
      // Refresh the symptoms list
      await fetchUserSymptoms();
      
    } catch (err) {
      setError(err.message || 'Failed to calculate risk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailChange = (field, value) => {
    setUserDetails(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) return <div className="-my-28"><Loading /></div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="mx-auto md:p-4 space-y-10 min-h-screen">
      <Card className="border border-border bg-background shadow-xl dark:shadow-blue-900/20 rounded-2xl transition-colors">
        <CardContent className="p-6 md:p-8 space-y-8">
          {!showMetricsForm ? (
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
          ) : (
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Possible Conditions
                </h2>
                
                <div className="grid gap-4">
                  {predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl transition-all border ${
                        index === 0
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`h-3 w-3 rounded-full ${
                            index === 0 ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-500'
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

              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Help us assess your risk</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={userDetails.age}
                      onChange={(e) => handleDetailChange('age', e.target.value)}
                      placeholder="Enter your age"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select
                      value={userDetails.duration}
                      onValueChange={(value) => handleDetailChange('duration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less than a day">Less than a day</SelectItem>
                        <SelectItem value="1-3 days">1-3 days</SelectItem>
                        <SelectItem value="4-7 days">4-7 days</SelectItem>
                        <SelectItem value="more than a week">More than a week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select
                      value={userDetails.severity}
                      onValueChange={(value) => handleDetailChange('severity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={userDetails.gender}
                      onValueChange={(value) => handleDetailChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleMetricsSubmit}
                  size="lg"
                  className="w-full mt-4"
                  disabled={isLoading || !userDetails.age || !userDetails.duration}
                >
                  {isLoading ? 'Calculating Risk...' : 'Calculate Risk Assessment'}
                </Button>
              </div>

              {riskFactor !== null && (
                <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Risk Assessment
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Progress
                        value={riskFactor}
                        className="h-3 w-64"
                        indicatorcolor={
                          riskFactor > 70 ? 'bg-red-500' :
                          riskFactor > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }
                      />
                      <div 
                        className="absolute top-0 h-3 bg-transparent border-r-2 border-gray-700 dark:border-gray-300" 
                        style={{ left: `${riskFactor}%` }}
                      />
                    </div>
                    <Badge
                      variant={
                        riskFactor > 70 ? 'destructive' :
                        riskFactor > 40 ? 'secondary' : 'default'
                      }
                      className="text-lg px-4 py-1"
                    >
                      {riskFactor}% Risk
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {riskFactor > 70 ? 'High risk - Consider consulting a healthcare professional soon' :
                     riskFactor > 40 ? 'Moderate risk - Monitor your symptoms closely' : 
                     'Low risk - Likely not serious, but monitor for changes'}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-lg text-sm">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{error}</p>
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
                  <TableCell>
                    <Badge
                      variant={
                        symptom.riskFactor > 70 ? 'destructive' :
                        symptom.riskFactor > 40 ? 'secondary' : 'default'
                      }
                    >
                      {symptom.riskFactor}%
                    </Badge>
                  </TableCell>
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