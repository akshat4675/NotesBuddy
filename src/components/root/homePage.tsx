import "../globals.css";
import { BookOpen, Calendar,  LogOut, Menu, NotebookPen} from "lucide-react"
import { Button } from "@/components/ui/button"
import {  useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider ,TooltipTrigger} from "../ui/tooltip";
import { Label } from "../ui/label";


const HomePage = () => {

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex min-h-screen">
      <Sheet>
          <SheetTrigger asChild>
           <Button variant="default" className="lg:hidden absolute top-0 right-0 h-16 w-16 bg-transparent hover:bg-sky-100  ">
            <Menu className=" text-blue-950" />
           </Button>
          </SheetTrigger> 
          <SheetContent side="left" className="bg-black h-full w-auto overflow-hidden ">
           <SideBarfunction2/>
          </SheetContent>
        </Sheet>
      </div>
      <main className="flex-1 overflow-y-auto">
      <header className=" pt-5">
         <div className="flex items-center justify-center h-10 ">
          <NotebookPen className="size-9 text-blue-600" />
          <Label className="ml-2 text-5xl text-sky-950 font-semibold ">StudyBuddy</Label>
        </div>
        </header>
        <div className="fixed mx-3 hidden h-5/6 rounded-3xl bg-background w-14 bg-black lg:block" >
        <SideBarfunction/>
        </div>
      <>
        
      </>
      </main>
    </div>
  );
};

function SideBarfunction(){

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  const studymaterial =()=>
    {
      navigate('/studymaterials');
    }
  const schedul =()=>{
    navigate('/schedule');
  }
  


  return(
    <>
    <div className="flex h-full flex-col">
          <div className="flex items-center justify-center h-16 ">
            <NotebookPen className="h-6 w-6 text-blue-600 " />
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-1 space-y-1">
              <li>
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button onClick={studymaterial} variant="ghost" className=" text-sky-200 justify-start">
                <BookOpen  className="" />
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Study Materials</p>
                </TooltipContent>
              </Tooltip>
              </TooltipProvider>
                  
              </li>
              <li>
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button onClick={schedul} variant="ghost" className=" text-sky-200 justify-start">
                  <Calendar className=" h-2 w-2" /> 
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Schedule</p>
                </TooltipContent>
              </Tooltip>
              </TooltipProvider>
              </li>
            </ul>
          </nav>
          <div className="p-3">
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button variant={"secondary"} onClick={handleLogout} className="text-xs bg-rose-100 w-full">
              <LogOut className="h-2 w-2 size-1/2" />
            </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Schedule</p>
                </TooltipContent>
              </Tooltip>
              </TooltipProvider>
          </div>
        </div>
    </>
  )
}



function SideBarfunction2(){
  
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  const studymaterial =()=>
    {
      navigate('/studymaterials');
    }
  const schedul =()=>{
    navigate('/schedule');
  }
  


  return(
    <>
    <div className="flex h-full flex-col">
          <div className="flex items-center bg-black justify-center h-16 ">
            <NotebookPen className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-xl text-sky-200 font-semibold">StudyBuddy</span>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-2 space-y-1">
              <li>
                <Button onClick={studymaterial} variant="ghost" className="  text-sky-200  w-full justify-start">
                  <BookOpen  className="mr-2 h-4 w-4" />
                  
                  Study Materials
                </Button>
              </li>
              <li>
                <Button onClick={schedul} variant="ghost" className=" text-sky-200   w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" /> 
                  Schedule
                </Button>
              </li>
            </ul>
          </nav>
          <div className="p-4">
            <Button variant={"secondary"} onClick={handleLogout} className="bg-rose-100 w-full">
              <LogOut className=" mr-2 h-4 w-4 " />
              Log out
            </Button>
          </div>
        </div>
    </>
  )
}

export default HomePage;