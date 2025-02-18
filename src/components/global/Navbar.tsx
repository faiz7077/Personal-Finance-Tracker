'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function Navbar() {
  const { setTheme, theme } = useTheme()

  // Define button styles based on the theme
  const buttonStyles = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-500 text-white'

  return (
    <div className="border-b">
      <div className="container mx-auto p-4 flex flex-row justify-between ">
        <Link href="/" passHref>
          <h1 className="text-3xl font-bold cursor-pointer hover:text-blue-600">
            Personal Finance Tracker
          </h1>
        </Link>
        <div className="flex flex-row gap-4">
        <Button className={`hover:bg-blue-600 ${buttonStyles}`}>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </div>
  )
} 