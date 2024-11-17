import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { NotebookPen, House, Calendar, LogOut, BookOpen} from "lucide-react";
import { Button } from "../../ui/button";
import "@/globals.css";

export function SideBar(){

    const navigate = useNavigate();
  
    const handleLogout = () => {
      sessionStorage.clear();
      navigate('/login');
    };
    const Home =()=>
      {
        navigate('/home');
      }
    const schedul =()=>{
      navigate('/schedule');
    }
    const studymaterials =()=>{
      navigate('/studymaterials');
    }
  
  
    return(
      <>
      <div className="fixed pt-6 ">
      <div className="fixed mx-3 hidden h-96 rounded-3xl bg-background w-14 shadow-fuchsia-800 bg-violet-100 lg:block">
      <div className="flex h-full flex-col">
            <div className="flex items-center justify-center h-20 ">
              <NotebookPen className="h-6 w-6  brightness-200 text-blue-800 " />
            </div>
            
            <nav className="flex-1 overflow-y-auto">
              <ul className="p-1  space-y-1">
                <li>
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button onClick={Home} variant="ghost" className="text-black  rounded-full  justify-start">
                  <House  className="brightness-200"  />
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
                </li>
                <li>
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button onClick={studymaterials} variant="ghost" className=" text-black rounded-full  justify-start">
                    <BookOpen className="brightness-200 h-2 w-2" /> 
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
                  <Button onClick={schedul} variant="ghost" className=" text-black rounded-full  justify-start">
                    <Calendar className="brightness-200 h-2 w-2" /> 
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
                  <Button variant={"default"} onClick={handleLogout} className="text-xs  text-teal-950 bg-indigo-950 w-full">
                <LogOut className="h-2 w-2 size-1/2 text-off-white brightness-200" />
              </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>
          </div>
          </div>
          </div>
      </>
    )
  }
 
  export function SidePanel(){

    const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  const home =()=>
  {
    navigate('/home');
  }
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
                <Button onClick={home} variant="ghost" className="  text-sky-200  w-full justify-start">
                  <House  className="mr-2 h-4 w-4" />
                  
                  Home
                </Button>
              </li>
              <li>
                <Button onClick={studymaterial} variant="ghost" className="  text-sky-200  w-full justify-start">
                  <House  className="mr-2 h-4 w-4" />
                  
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