import "../globals.css";
import { House, LogOut, NotebookPen, DeleteIcon, Menu, Calendar, BookOpen, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllEvents, addEvent, deleteEventByName } from "../root/dynamoDBService";
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider ,TooltipTrigger} from "../ui/tooltip";

// Define event structure
interface Event {
  id: string;
  eventName: string;
  date: string;
}

const Schedule = () => {
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex min-h-screen">
      <Sheet>
          <SheetTrigger asChild>
           <Button variant="default" className="lg:hidden flex bg-transparent hover:bg-slate-500 " size="icon" >
            <Menu className=" text-blue-950 " />
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
          <NotebookPen className="h-6 w-6 text-blue-600" />
          <Label className="ml-2 text-5xl text-sky-950 font-semibold ">StudyBuddy</Label>
        </div>
        </header>
        <div className="fixed mx-3 hidden h-5/6 rounded-3xl bg-background w-14 bg-black lg:block" >
        <SideBarfunction/>
        </div>
        <div className="pt-16">
          <Card className="w-full bg-white bg-opacity-20 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Schedule</CardTitle>
              <CardDescription className=" text-slate-400 text-xs text-center">Only you can see these events </CardDescription>  
            </CardHeader>
            <CardContent>
              <div>
                {events.length > 0 ? (
                  <ul>
                    {events.map((event) => (
                      <li
                        className="flex justify-between items-center bg-muted p-2 rounded"
                        key={event.id}
                      >
                        <Label className="font-medium">{event.eventName}</Label>
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
                  <p>No events found.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Add New Event</Label>
                  <Input
                    type="text"
                    placeholder="Event Name"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleAddEvent}>
                  Add Event
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};



function SideBarfunction2(){
  
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  const home =()=>
    {
      navigate('/home');
    }
  const studymaterials =()=>{
    navigate('/studymaterials');
  }
  const assignement =()=>{
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
                <Button onClick={home} variant="ghost" className="  text-sky-200  w-full justify-start">
                  <BookOpen  className="mr-2 h-4 w-4" />
                  
                  Home
                </Button>
              </li>
              <li>
                <Button onClick={studymaterials} variant="ghost" className=" text-sky-200   w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" /> 
                  Study Materials
                </Button>
              </li>
              <li>
                <Button onClick={assignement} variant="ghost" className=" text-sky-200   w-full justify-start">
                  <ClipboardCheck className="mr-2 h-4 w-4" /> 
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

function SideBarfunction(){

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  const Home =()=>
    {
      navigate('/home');
    }
  const studymaterials =()=>{
    navigate('/studymaterials');
  }
  const assignement =()=>{
    navigate('/assignment');
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
                <Button onClick={studymaterials} variant="ghost" className=" text-sky-200 justify-start">
                  <BookOpen className=" h-2 w-2" /> 
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
    </>
  )
}

export default Schedule;
