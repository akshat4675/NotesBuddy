import "@/globals.css"
import { addToDo, getToDos, completeToDo, deleteToDo } from '../Funtions/todo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { DeleteIcon } from "lucide-react";
import { useNavigate } from "react-router";


type ToDo = {
    taskId: string;
    taskDescription: string;
    isCompleted: boolean;
  };
  
  

export function ToDoList() {
    const [toDos, setToDos] = useState<ToDo[]>([]);
    const [taskDescription, setTaskDescription] = useState("");
  
    const naviagte = useNavigate();

  function login ()
  {
    naviagte('/login')
  }
 
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return !!accessToken;
  };

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
        
        {toDos.length >0? 
        (
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
       ):(<div className="flex"><h1>No Tasks added yet.</h1></div>) }
        
        <div className="pt-3 gap-3">
        
        <Input
        type="text"
        placeholder="Add a new task"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        className=" bg-gray-400 placeholder:text-slate-700 lg:text-xl text-xl font-bold"
        />
        
        <div className="pt-2">
        {isAuthenticated()? (<><Button 
        onClick={handleAddToDo} variant={"secondary"} 
        className="w-1/2 bg-gray-800 hover:text-black text-white text-xl">
          Add
        </Button></>):(<><Button 
        onClick={login} variant={"secondary"} 
        className="w-1/2 bg-gray-800 hover:text-black text-white text-xl">
          Add
        </Button></>)}
        
        </div>
        </div>
      </>
    );
  }