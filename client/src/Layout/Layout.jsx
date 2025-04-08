import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import  AppSidebar  from "@/components/AppSidebar"
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
function Layout() {
  return (
    //toolbar
    <SidebarProvider>
    <Topbar />
      <AppSidebar />
        <main className="w-full">
          <div className='w-full min-h-[calc(100vh-35px)] pt-28 px-14'>
               <Outlet />
           </div>
           <Footer />
        </main>
    </SidebarProvider>
    
  )
}

export default Layout