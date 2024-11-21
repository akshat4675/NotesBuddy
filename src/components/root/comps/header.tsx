import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import "@/globals.css";
import { LogOut, Menu, NotebookPen, UserPen } from "lucide-react";
import { SidePanel } from "./sidebar";
import { useNavigate } from "react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";





export function Head()

{  
  const navigate = useNavigate();
  
  const handleLogout = () => {
  sessionStorage.clear();
  navigate('/login');
};

function login(){
  navigate('/login');
}

const profile=()=>{
  navigate('/edituser');
}
const isAuthenticated = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  return !!accessToken;
};

    return (
        <>
        <header className="flex items-center lg:pl-6  justify-between p-4 bg-transparent shadow-none">
        <div className="flex items-center lg:pt-9 space-x-4">
             <div className="w-full h-1 lg:pl-28  bg-primary rounded-full flex items-center justify-center">
             <span className="text-primary-foreground font-bold text-xl"><NotebookPen className="size-9 text-blue-600"/></span>
              </div>
              
               <h1 className="text-2xl lg:text-3xl font-bold text-white pr-10">NotesVerse</h1>
               {isAuthenticated()? (<></>):(<> <Button variant={"secondary"} onClick={login} className="bg-sky-300 font-bold">Login</Button></>)}
              
               </div>
               {isAuthenticated()? (
               <div className="grid  gap-2 lg:flex grid-cols-1"> 
               <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button onClick={profile} className="lg:ml-96 lg:mt-5 bg-off-white hover:bg-teal-300 text-black" ><UserPen/></Button>                  
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Profile</p>
                    
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
              
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button onClick={handleLogout} className="bg-off-white hover:bg-rose-300  text-black lg:mr-40 lg:mt-5" ><LogOut/></Button>                
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
        </div>):(<></>)}
        </header>
        </>
    )
}

export function Sheett(){
 

  
    return (
      <div>
      
      <Sheet>
            <SheetTrigger asChild>
            <Button variant="ghost" className="lg:hidden  font-white ">
            <Menu className="" />
             </Button>
            </SheetTrigger> 
            <SheetContent side="left" className=" bg-black h-full w-auto overflow-hidden ">
             <SidePanel/>
            </SheetContent>
          </Sheet>
          </div>
    )
  }