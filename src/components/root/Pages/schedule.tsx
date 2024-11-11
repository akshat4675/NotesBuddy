import "@/globals.css";
import { DeleteIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getAllEvents, addEvent, deleteEventByName } from "../Funtions/dynamoDBService";
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Label } from "@/components/ui/label";
import { SideBar } from "../comps/sidebar";
import { Head } from "../comps/header";

// Define event structure
interface Event {
  id: string;
  eventName: string;
  date: string;
}

const Schedule = () => {
  
  return (
    <>
    <div className="h-screen">
    <div>
        <Head/>
        <SideBar/>
        </div>
        <div className="lg:justify-items-center pt-16 grid grid-cols-1 ">
          <div>
            <Card className=" lg:w-[700px] md:mx-10 bg-sky-100 text-center bg-opacity-40  ">
              <ScheduleCard/>
            </Card>
          </div>
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
    <div >
          <Card className="bg-transparent border-transparent">
            <CardHeader>
              <CardTitle className="text-center">Schedule</CardTitle>
              <CardDescription className=" text-slate-400 text-xs text-center">Reminders , deadlines , etc... </CardDescription>  
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
                  <p>No events found.</p>
                )}
              </div>
              <div className="grid pt-5 grid-cols-2 gap-2">
                <div>
                  <Label className="flex" >Add New Event</Label>
                  <Input
                    type="text"
                    placeholder="Event Name"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    className="bg-opacity-20 font-bold text-teal-950"
                  />
                </div>
                <div>
                  <Label className="flex" >Date</Label>
                  <Input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="bg-opacity-20  text-teal-950"
                  />
                </div>
                </div>
            </CardContent>
            <CardFooter>
              
                <Button className="w-full" onClick={handleAddEvent}>
                  Add Event
                </Button>

            </CardFooter>
          </Card>
        </div>
    </>
  )
};



export default Schedule;
