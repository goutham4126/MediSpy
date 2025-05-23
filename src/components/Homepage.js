import Footer from "./Footer"
import Header from "./Header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaSearch, FaPrescriptionBottleAlt, FaRobot, FaHospital } from "react-icons/fa";

function Homepage() {
   const features = [
    {
      icon: <FaSearch className="h-6 w-6" />,
      title: "Symptom Analyzer",
      description: "AI-powered symptom to disease finder with accurate assessments"
    },
    {
      icon: <FaPrescriptionBottleAlt className="h-6 w-6" />,
      title: "Digital Prescriptions",
      description: "Get prescriptions and video consultations with certified doctors"
    },
    {
      icon: <FaRobot className="h-6 w-6" />,
      title: "AI Health Assistant",
      description: "Smart chatbot for prescription help and medical advice"
    },
    {
      icon: <FaHospital className="h-6 w-6" />,
      title: "Hospital Locator",
      description: "Find the nearest hospitals and specialists in your area"
    }
  ];
  return (
    <div>
      <Header />
      <div className="px-4">
        <div className="flex justify-center items-center my-12 md:my-16 text-center">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-900 leading-tight">
              <span className="block">
                Your <span className="text-blue-600">Health</span>.
              </span>
              <span className="block">
                Our <span className="text-blue-600">Priority</span>.
              </span>
            </h1>
            <p className="my-6 md:my-8 text-lg md:text-2xl font-semibold">
              Most trusted and  <span className="text-blue-600">#1 most-used healthcare platform.</span>
            </p>
          </div>
        </div>
        
        {/* Curved Divider */}
        <div className="relative md:py-32">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-40 md:h-60"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              className="fill-blue-600"
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              className="fill-blue-500 opacity-90"
            ></path>
          </svg>
          
          {/* Feature Showcase */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 max-w-5xl">
            <div>
              <img 
                src="/main-2.png" 
                alt="Feature showcase" 
                className="w-full h-auto rounded-xl shadow-2xl border-4 border-white ring-4 ring-blue-200/50"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-lg shadow-lg">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="py-12 md:pt-32 md:pb-16 bg-white">
          <div className="container px-4 md:px-8">
            <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-4xl text-blue-900">
                Our Powerful Features
              </h2>
              <p className="max-w-[85%] leading-normal text-blue-800/80 sm:text-lg font-semibold">
                Everything you need for comprehensive healthcare at your fingertips
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg hover:shadow-blue-200/30 hover:scale-[1.02]"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-blue-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="font-semibold text-sm text-blue-800/80">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
            
      </div>
      <Footer/>
    </div>
  )
}

export default Homepage