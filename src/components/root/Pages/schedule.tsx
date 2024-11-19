import "@/globals.css";
import { DeleteIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getAllEvents, addEvent, deleteEventByName } from "../Funtions/dynamoDBService";
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addToDo, getToDos, completeToDo, deleteToDo } from '../Funtions/todo';

// Define event structure
interface Event {
  id: string;
  eventName: string;
  date: string;
}

const Schedule = () => {
  
  return (
    <>
    
        <div className="lg:justify-items-center  pt-1">
          
          <div className="">
          <Card className="bg-transparent  lg:h-[500px]  border-transparent">
             
              <CardContent>
                <Tabs defaultValue="schedule" >
                  <TabsList className="mb-4 bg-slate-800 shadow-violet-300 shadow-sm" >
                    <TabsTrigger value="schedule" className="text-white">Schedule</TabsTrigger>
                    <TabsTrigger value="todos" className="text-white">To-Do List</TabsTrigger>
                  </TabsList>
                  <TabsContent value="schedule">
                    <div className="bg-violet-100 lg:h-[340px] p-5 pt-5 bg-opacity-90 rounded-md">
                      <div className="flex text-2xl font-bold">Your Schedule </div>
                      <div className=" flex text-sm  pb-5">Reminder , deadlines etc...</div>
                    <ScheduleCard/>
                    </div>
                  </TabsContent>
                  <TabsContent value="todos">
                  <div className="bg-violet-100 h-[340px] p-5 pt-5 bg-opacity-90 rounded-md">
                      <div className="flex text-2xl font-bold">Your ToDos </div>
                      <div className=" flex text-sm  pb-5">Tasks , goals etc...</div>
                    <ToDoList/>
                    </div>
                  </TabsContent>
                </Tabs>
                
              </CardContent>
            </Card>
          </div>
        </div>   
        </> 
  );
};


const ScheduleCard =()=> {


  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  // Fetch all events from DynamoDB for the specific user
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response: ScanCommandOutput = await getAllEvents();
      setEvents(response.Items as Event[]);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new event
  const handleAddEvent = async () => {
    try {
      if (newEventName && newEventDate) {
        const newEventId = `event_${Date.now()}`;
        await addEvent(newEventId, newEventName, newEventDate);
        alert("Event added successfully!");
        fetchAllEvents(); // Refresh the list after adding
        setNewEventName(""); // Clear input fields
        setNewEventDate("");
      } else {
        alert("Please enter all fields.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event.");
    }
  };

  // Delete an event
  const handleDeleteEvent = async (event: Event) => {
    try {
      await deleteEventByName(event.eventName); // Pass id and eventName
      alert("Event deleted successfully!");
      fetchAllEvents(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event.");
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <>
         <div className="grid grid-cols-1">
              <div>
                {events.length > 0 ? (
                  <ul>
                    {events.map((event) => (
                      <li
                        className="flex justify-between items-center bg-muted rounded"
                        key={event.id}
                      >
                        <Label className="font-bold text-lg">{event.eventName}</Label>
                        <Label className="ml-2 text-sm text-muted-foreground">
                          {event.date}
                        </Label>
                        <button onClick={() => handleDeleteEvent(event)}>
                          <DeleteIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No events added yet.</p>
                )}
              </div>
              <div className="grid pt-5 grid-cols-1 lg:grid-cols-2 gap-1">
                <div>
                  <Label className="flex pb-2  font-bold pt-2" >Add New Event</Label>
                  <Input
                    type="text"
                    placeholder="Event Name"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    className=" bg-gray-400 placeholder:text-slate-800  font-bold"
                  />
                </div>
                <div className="pb-2">
                  <Label className="flex pb-2  font-bold pt-2" >Date</Label>
                  <Input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="bg-gray-400 placeholder:text-slate-800 font-bold"
                  />
                </div>
                </div>
                <Button className="w-1/2" onClick={handleAddEvent}>
                  Add Event
                </Button>
                </div>
    </>
  )
};

type ToDo = {
  taskId: string;
  taskDescription: string;
  isCompleted: boolean;
};

export function ToDoList() {
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
      <Button 
      onClick={handleAddToDo} variant={"secondary"} 
      className="w-1/2 bg-gray-800  text-white text-xl">
        Add
      </Button>
      </div>
      </div>
    </>
  );
}

export default Schedule;