import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog,DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import "@/globals.css"
import { getAllRequests, postreq } from "../Funtions/publicnotes"
import { useEffect, useState } from "react"
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircleQuestion } from "lucide-react"

interface Event {
  id: string;
  eventName: string;
  date: string;
}


export function Publicnotes (){

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState("");


  // Fetch all events from DynamoDB for the specific user
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response: ScanCommandOutput = await getAllRequests();
      setEvents(response.Items as Event[  ]);
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
      if (newEventName) {
        
        await postreq(newEventName);
        alert("Event added successfully!");
        fetchAllEvents(); // Refresh the list after adding
        setNewEventName(""); // Clear input fields
      } else {
        alert("Please enter all fields.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event.");
    }
  };

  // Delete an event
 

  useEffect(() => {
    fetchAllEvents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


    return(
        <>
        <div className="justify-items-center  lg:pr-10">
          <Card className="lg:w-[600px] h-[550px]  bg-violet-200 ">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center font-inter text-indigo-950">Notes Exchange</CardTitle>
              <div className="text-base text-gray-600 text-center">Post Notes for your friends .... </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-10 grid-cols-2">
                <div>
                  <Card className="w-[250px] bg-transparent border-transparent shadow-none h-[300px]">
                    <h1 className=" text-center pt-2">Requests by other students</h1>
                    <CardContent className="pt-4">
                    <ScrollArea className=" h-[150px] rounded-sm text-dark-4  p-2">
                {events.length > 0 ? (
                  <ul>
                    {events.map((event) => (
                      <li
                        className="flex justify-between items-center bg-muted rounded"
                        key={event.id}
                      >
                        <MessageCircleQuestion/>
                        <Label className="font-bold text-sm">{event.eventName}</Label>
                        <Label className="text-sm text-muted-foreground">
                          {event.date}
                        </Label>
                      
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Requests yet.</p>
                )}
              </ScrollArea>
                    </CardContent>
                    <CardFooter className="">
                    <Input
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                     className="text-sm "  placeholder="Make request"/>
                    <Button variant={"ghost"} onClick={handleAddEvent}>Post</Button>
                    </CardFooter>
                  </Card>
                </div>
                <div >
                <Card className="w-[250px]  bg-rose-100  h-[300px]">
                  <h1 className="text-center pt-2 font-semibold text-black">Public Posts</h1>
                     
                </Card>
              </div>
              </div>
              
            </CardContent>
            <CardFooter className="grid items-center grid-cols-1 ">
            <Dialog>
                <DialogTrigger>
                    <Button>Make a Post</Button>
                </DialogTrigger>
                <DialogContent className="grid grid-cols-1 justify-items-center bg-fuchsia-100">
                    <div className="text-center text-xl font-bold  text-teal-950">Post public Notes  </div>
                <div >
                <h1 className="text-black">Topic Name</h1>
                <Input type="text" placeholder="Topic Name"/>
                <Input type="file" className="mt-2"/>
                 <Button className="mt-2 ">Post</Button>
                 </div>
                </DialogContent>
            </Dialog>
            </CardFooter>
          </Card>
          </div>
        </>
    )
};