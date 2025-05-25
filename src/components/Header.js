"use client"
import { SignInButton, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { FaUserDoctor } from "react-icons/fa6";

const Header = () => {

  return (
    <SignedOut>
      <header className="w-full border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
                <FaUserDoctor/>
              </div>
              <span className="ml-3 text-xl">MediSpy</span>
            </a>
          </div>
          <div>
            <Button className="text-sm font-semibold bg-blue-600 text-white" variant="outline" asChild>
              <SignInButton mode="modal" />
            </Button>
          </div>
        </div>
      </header>
    </SignedOut>
  )
}


export default Header
