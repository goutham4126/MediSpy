import { checkUser } from "@/lib/auth"

async function page() {
  const user = await checkUser();
  return (
    <div className="w-full h-screen">
      {
        user?.role === "DOCTOR" ? (
          <iframe
            src="https://healcare-videochat.vercel.app/create"
            width="100%"
            height="100%"
            allow="camera; microphone; fullscreen"
            allowFullScreen
            className="border-none"
          />
        ) :(
          <iframe
            src="https://healcare-videochat.vercel.app/join"
            width="100%"
            height="100%"
            allow="camera; microphone; fullscreen"
            allowFullScreen
            className="border-none"
          />
        )
      }
    </div>
  )
}

export default page
