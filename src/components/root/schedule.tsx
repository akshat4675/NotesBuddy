import "../globals.css";
import { House, LogOut, NotebookPen, DeleteIcon, Menu, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllEvents, addEvent, deleteEventByName } from "../root/dynamoDBService";
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

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
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <SideBarFunction />
        </aside>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black w-64 p-0">
            <SideBarFunction />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-black shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-semibold">Schedule and Calendar</h1>
          </div>
        </header>
        <div>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription className=" flex text-slate-400 text-xs">Only you can see these events </CardDescription>  
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

function SideBarFunction() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  const goToHome = () => {
    navigate("/home");
  };
  const goToStudyMaterials = () => {
    navigate("/studymaterials");
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-center h-16 border-b">
          <NotebookPen className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-xl font-semibold">StudyBuddy</span>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            <li>
              <Button onClick={goToHome} variant="ghost" className="w-full justify-start">
                <House className="mr-2 h-4 w-4" />
                Home
              </Button>
            </li>
            <li>
              <Button onClick={goToStudyMaterials} variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Study Materials
              </Button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" onClick={handleLogout} className="bg-black w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}

export default Schedule;
