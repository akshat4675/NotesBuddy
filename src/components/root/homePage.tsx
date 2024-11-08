import "@/globals.css";
import { BookOpen, Calendar,  ClipboardCheck,  DeleteIcon,  LogOut, Menu, NotebookPen} from "lucide-react"
import { Button } from "@/components/ui/button"
import {  useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider ,TooltipTrigger} from "../ui/tooltip";
import { Label} from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { addToDo, getToDos, completeToDo, deleteToDo } from '../root/Funtions/todo';
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious,} from "@/components/ui/carousel"


const HomePage = () => {


  return (
      <>
    <div className="h-screen">
    <header className="top-3 left-0 right-0 h-16 bg-transparent flex items-center justify-center">
      <div className="flex items-center">
          <NotebookPen className="size-9 text-blue-600 " />
          <h1 className="lg:text-5xl text-3xl font-bold text-sky-950 ">StudyBuddy</h1>
      </div>
        <Sheet>
          <SheetTrigger asChild>
           <Button variant="secondary" className="lg:hidden bg-transparent hover:bg-sky-100  ">
           <Menu className=" text-blue-950 " />
           </Button>
          </SheetTrigger> 
          <SheetContent side="left" className=" bg-black h-full w-auto overflow-hidden ">
           <SideBarfunction2/>
          </SheetContent>
        </Sheet>
        </header> 
        <div className="fixed">
        <div className="fixed mx-3 hidden h-5/6 rounded-3xl bg-background w-14 bg-black lg:block" >
        <SideBarfunction/>
        </div>
        </div>
        <div className="lg:justify-items-center lg:grid-cols-2 grid grid-cols-1 mx-12 ">
          <div className="pt-10  ">
          <Carousel className="w-full max-w-xs">
          <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
           <CarouselPrevious />
           <CarouselNext />
           </Carousel>
          </div>
          <div className="pt-10 ">
            <Card className="bg-white lg:w-[500px] bg-opacity-40">
              <CardHeader>
              <CardTitle className="text-center">Your To-Dos..</CardTitle>
              </CardHeader>
              <CardContent>
              <ToDoList/>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>
          </div>
        </div> 
        </div> 
      </>
  )
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
  const assignment =()=> {
    navigate('/assignment');
  }


  return(
    <>
    <div className="flex h-full  flex-col">
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
              <li>
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button onClick={assignment} variant="ghost" className=" text-sky-200 justify-start">
                  <ClipboardCheck className=" h-2 w-2" /> 
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assignment</p>
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
  const assignment =()=> {
    navigate('/assignement');
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

type ToDo = {
  taskId: string;
  taskDescription: string;
  isCompleted: boolean;
};

function ToDoList() {
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [taskDescription, setTaskDescription] = useState("");

  useEffect(() => {
    fetchToDos();
  }, []);

  const fetchToDos = async () => {
    const todos = await getToDos();
    setToDos(todos || []);
  };

  const handleAddToDo = async () => {
    if (taskDescription) {
      await addToDo(taskDescription);
      setTaskDescription("");
      fetchToDos();
    }
  };

  // Toggle `isCompleted` state
  const handleComplete = async (taskId: string, currentStatus: boolean) => {
    await completeToDo(taskId, !currentStatus);  // Toggle the status
    fetchToDos();
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteToDo(taskId);
      fetchToDos();
    }
  };


  return (
    <>
      
      <ul>
      {toDos.map((todo) => (
      <li key={todo.taskId} className="flex justify-between items-center bg-muted p-2 rounded">
      <div className="flex gap-1">
      <Label className="text-base" style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
      {todo.taskDescription}
      </Label>
      <Label className="font-bold text-lg">{todo.isCompleted}</Label>
      <Input
      type="checkbox"
      checked={todo.isCompleted}
      onChange={() => handleComplete(todo.taskId,todo.isCompleted)}
      className="size-auto"
      />
      </div>
      <button onClick={() => handleDelete(todo.taskId,)}>
      <DeleteIcon />
      </button>
      </li>
      ))}
      </ul>  
      <div className="pt-3 gap-3">
      <Input
      type="text"
      placeholder="Add a new task"
      value={taskDescription}
      onChange={(e) => setTaskDescription(e.target.value)}
      className="bg-opacity-20 lg:text-xl text-xs font-bold"
      />
      <Button 
      onClick={handleAddToDo} variant={"ghost"} 
      className="w-full  bg-transparent hover:bg-white text-teal-950 text-xl font-bold">
        Add
      </Button>
      </div>
    </>
  );
}

export default HomePage;