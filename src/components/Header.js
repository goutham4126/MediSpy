"use client"

import { IoLogoDocker } from "react-icons/io5";
import { useState } from "react"
import { SignInButton, SignedOut } from "@clerk/nextjs"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Instagram, Twitter, Menu, X } from "lucide-react"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <SignedOut>
      <header className="w-full border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-lg">
              <IoLogoDocker className="h-8 w-8 text-blue-600" />
            </span>
          </div>

          {/* Mobile toggle button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <NavigationMenu className="hidden md:flex space-x-8">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/products" className="text-xl font-semibold">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/pricing" className="text-xl font-semibold">Pricing</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xl font-semibold">Contact</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="p-4 w-[250px] space-y-3">
                    <ContactItem icon={<Mail className="h-4 w-4 mr-2" />} title="Email" value="support@example.com" href="mailto:support@example.com" />
                    <ContactItem icon={<Phone className="h-4 w-4 mr-2" />} title="Phone" value="+91 9876543210" href="tel:+919876543210" />
                    <ContactItem icon={<Instagram className="h-4 w-4 mr-2" />} title="Instagram" value="@ourpage" href="https://instagram.com" />
                    <ContactItem icon={<Twitter className="h-4 w-4 mr-2" />} title="Twitter" value="@ourhandle" href="https://twitter.com" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/blog" className="text-xl font-semibold">Blog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Sign In Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button className="text-sm font-semibold bg-blue-600 text-white" variant="outline" asChild>
              <SignInButton mode="modal" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 bg-white border-t">
            <ul className="space-y-4 mt-4">
              <li><Link href="/products" className="block font-medium text-base">Products</Link></li>
              <li><Link href="/pricing" className="block font-medium text-base">Pricing</Link></li>
              <li><Link href="/blog" className="block font-medium text-base">Blog</Link></li>
              <li>
                <div className="font-semibold mb-2">Contact</div>
                <ul className="space-y-2 ml-4">
                  <ContactItem icon={<Mail className="h-4 w-4 mr-2" />} title="Email" value="support@example.com" href="mailto:support@example.com" />
                  <ContactItem icon={<Phone className="h-4 w-4 mr-2" />} title="Phone" value="+91 9876543210" href="tel:+919876543210" />
                  <ContactItem icon={<Instagram className="h-4 w-4 mr-2" />} title="Instagram" value="@ourpage" href="https://instagram.com" />
                  <ContactItem icon={<Twitter className="h-4 w-4 mr-2" />} title="Twitter" value="@ourhandle" href="https://twitter.com" />
                </ul>
              </li>
              <li>
                <SignInButton mode="modal">
                  <Button className="w-full bg-blue-600 text-white">Sign In</Button>
                </SignInButton>
              </li>
            </ul>
          </div>
        )}
      </header>
    </SignedOut>
  )
}

const ContactItem = ({ icon, title, value, href }) => (
  <li>
    <a href={href} className="flex items-center text-sm hover:underline">
      {icon}
      <div>
        <div className="text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{value}</div>
      </div>
    </a>
  </li>
)

export default Header
