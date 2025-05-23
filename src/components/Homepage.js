import Footer from "./Footer"
import Header from "./Header"

function Homepage() {
  return (
    <div>
      <Header />
      <div className="px-4">
        <div className="flex justify-center items-center my-12 md:my-16 text-center">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-900 leading-tight">
              <span className="block">
                Develop <span className="text-blue-600">faster</span>.
              </span>
              <span className="block">
                Deploy <span className="text-blue-600">anywhere</span>.
              </span>
            </h1>
            <p className="my-6 md:my-8 text-lg md:text-2xl font-semibold">
              Build with the <span className="text-blue-600">#1 most-used developer tool.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button className="w-full sm:w-auto text-white bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg">
                Get started
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 inline ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              
              <button className="w-full sm:w-auto px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 text-gray-700 shadow-sm">
                Explore features
              </button>
            </div>
            
            <div className="mt-12 flex justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
                <span className="text-gray-600 font-medium">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <span className="text-gray-600 font-medium">Cloud Ready</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved Divider */}
        <div className="relative md:py-16">
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
                src="/main.png" 
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
        
        {/* Stats Section */}
        <div className="mt-20 mb-10 md:mt-32 md:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { value: "10M+", label: "Developers" },
              { value: "100K+", label: "Companies" },
              { value: "99.9%", label: "Uptime" },
              { value: "5x", label: "Faster" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Homepage