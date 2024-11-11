import "@/globals.css";
import { DeleteIcon} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label} from "../../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { addToDo, getToDos, completeToDo, deleteToDo } from '../Funtions/todo';
import { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious,} from "@/components/ui/carousel"
import {SideBar} from "../comps/sidebar";
import { Head } from "../comps/header";

const HomePage = () => {


  return (
      <>
    <div className="h-screen">
        <div>
        <Head/>
        <SideBar/>
        </div>
        <div className="lg:justify-items-center pt-10 lg:grid-cols-2 grid grid-cols-1 mx-12 ">
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