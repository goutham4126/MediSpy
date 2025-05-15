import React from 'react'

function page() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="https://healcare-videochat.vercel.app/create"
        width="100%"
        height="100%"
        allow="camera; microphone; fullscreen"
        allowFullScreen
        className="border-none"
      />
    </div>
  )
}

export default page
