import "../globals.css";
import { BookOpen, Calendar,  DeleteIcon,  LogOut, Menu, NotebookPen} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card"
import {  useNavigate } from 'react-router-dom';
import  { useState, useEffect } from "react";
import { getAllEvents, deleteEventByName } from "./dynamoDBService";
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Label } from "../ui/label";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";



interface Event {
  id: string;
  eventName: string;
  date: string;
}

const HomePage = () => {

  return (

    <div className=" flex h-screen bg-sky-100">
      {/* Sidebar */}
      <div className="text-sky-100" >s</div>
      <div className="flex min-h-screen bg-background">
      <aside className="hidden h-full overflow-hidden rounded-3xl bg-background p-2 bg-black   shadow-lg transition-all duration-300 ease-in-out bg-muted/40 lg:block">
        <SideBarfunction/>
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" className="lg:hidden flex bg-transparent hover:bg-slate-500 " size="icon" >
            <Menu className=" text-blue-950 " />
          </Button>
        </SheetTrigger> 
        <SheetContent side="left" className=" h-full overflow-hidden rounded-3xl bg-background p-2 bg-black w-auto shadow-lg transition-all duration-300 ease-in-out">
          <SideBarfunction /> 
        </SheetContent>
      </Sheet>
      </div>  
      {/* Main Content */}
      <main className="flex-auto overflow-y-auto ">
        <header className= "bg-sky-100">
         <div className="flex items-center justify-center h-16 ">
          <NotebookPen className="h-6 w-6 text-blue-600" />
          <Label className="ml-2  text-blue-950 text-3xl font-bold">StudyBuddy</Label>
        </div>
        </header>
        <div className="min-w-screen bg-background p-2">
        <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-sky-200" > 
          <CardHeader>
            <CardTitle className="text-center">To DOs and Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Card className="bg-yellow-100 w-auto h-auto border-transparent "> 
             <CardContent>
              <div>
                
              </div>
             </CardContent>
            </Card>
          </CardContent>
        </Card> 
        <Card className=" bg-sky-100 border-transparent">
                <Noticeboard/>              
        </Card>
        </div>
      </div>
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

function Noticeboard()
{

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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


  const handleDeleteEvent = async (event: Event) => {
    try {
      await deleteEventByName(event.eventName); // Pass both id and eventName
      alert("Event deleted successfully!");
      fetchAllEvents(); // Refresh the list after deleting an event
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
    <Card className="w-full bg-sky-200  max-w-3xl mx-auto">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-2xl font-bold text-center">Notice Board</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[400px] p-4">
          <Card  className="mb-4 bg-yellow-50 shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold"></CardTitle>
            </CardHeader>
            <CardContent>
            <div>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <>
            <li className="flex justify-between items-center bg-muted p-2 rounded"><Label  className="font-bold">Event Name</Label><Label className="font-bold">Date</Label>
            <Label className="font-bold">Delete Event</Label> </li>
            <li className="flex justify-between items-center bg-muted p-2 rounded" key={event.id}>
              <Label className="font-medium">{event.eventName}</Label><Label className="ml-2 text-sm text-muted-foreground"> {event.date}</Label>
              <button onClick={() => handleDeleteEvent(event)}><DeleteIcon></DeleteIcon></button>
            </li></>
          ))}
        </ul>
        
      ) : (
        <h2>No events found.  Add an event from schedule page to get started!</h2>

      )}
      </div>
          
            </CardContent>
          </Card>
      </ScrollArea>
    </Card>
    </>
  )
}

export default HomePage;