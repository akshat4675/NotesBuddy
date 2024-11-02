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


interface Event {
  id: string;
  eventName: string;
  date: string;
}

const HomePage = () => {

  

  /* dynamodb and database code */
 
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

    <div className=" flex h-screen bg-black-100">
      {/* Sidebar */}
      <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 border-r bg-muted/40 lg:block">
        <SideBarfunction/>
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-black w-64 p-0">
          <SideBarfunction />
        </SheetContent>
      </Sheet>
      </div>  
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        
        <div className="p-32 w-auto bg-black-400">
          

          {/* Recommended Study Materials */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>To Do list and Progress</CardTitle>
              
            </CardHeader>
            <CardContent>
              
            </CardContent>
          </Card>

          

          {/* Upcoming Exams/Deadlines */}
          <div>
            
            <Card className="w-full max-w-auto mx-auto">
            <CardHeader>
              <CardTitle>Upcoming events </CardTitle>
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
          <div className="flex items-center justify-center h-16 border-b">
            <NotebookPen className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-xl font-semibold">StudyBuddy</span>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-2 space-y-1">
              <li>
                <Button onClick={studymaterial} variant="ghost" className="w-full justify-start">
                  <BookOpen  className="mr-2 h-4 w-4" />
                  
                  Study Materials
                </Button>
              </li>
              <li>
                <Button onClick={schedul} variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t">
            <Button variant="outline" onClick={handleLogout} className="bg-black w-full">
              <LogOut className=" mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
    </>
  )
}

export default HomePage;