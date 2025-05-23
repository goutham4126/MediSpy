import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import Homepage from "@/components/Homepage";
import { Toaster } from "react-hot-toast";
import Location from "@/components/Location";
import AppSidebar from "@/components/Sidebar/app-sidebar";
import Chatbot from "@/components/Chatbot";
import { checkUser } from "@/lib/auth";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "App",
  description: "next app",
};

export default async function RootLayout({ children }) {
  const user=await checkUser();
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SignedIn>
            <SidebarProvider>
              <AppSidebar/>
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center justify-between gap-2 px-4 w-full">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center gap-8 text-blue-700">
                      {
                        user?.role!=="ADMIN" &&
                        <>
                         <Chatbot/>
                         <Location/>
                        </>
                      }
                    </div>
                  </div>
                </header>
                <div className="px-4">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </SignedIn>
          <SignedOut>
            <Homepage />
          </SignedOut>
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}
