import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { NotebookPen, House, Calendar, ClipboardCheck, LogOut} from "lucide-react";
import { Button } from "../../ui/button";

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
    const assignement =()=>{
      navigate('/assignment');
    }
  
  
    return(
      <>
      <div className="fixed mx-3 hidden h-5/6 rounded-3xl bg-background w-14 bg-black lg:block">
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
                  <Button onClick={Home} variant="ghost" className=" text-sky-200 justify-start">
                  <House  className="" />
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
                <li>
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button onClick={assignement} variant="ghost" className=" text-sky-200 justify-start">
                    <ClipboardCheck className=" h-2 w-2" /> 
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Assigments</p>
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
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
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
  const studymaterial =()=>
    {
      navigate('/studymaterials');
    }
  const schedul =()=>{
    navigate('/schedule');
  }
  const assignment =()=> {
    navigate('/assignment');
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
              <li>
                <Button onClick={assignment} variant="ghost" className=" text-sky-200   w-full justify-start">
                <ClipboardCheck className=" h-2 w-2" /> 
                  Assignment
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
