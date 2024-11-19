import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog,DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import "@/globals.css"
import { getAllRequests, postreq } from "../Funtions/requests"
import { useEffect, useState } from "react"
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircleQuestion } from "lucide-react"
import { fetchPdfUrlsFromDynamoDB, savePdfUrlToDynamoDB, uploadPdfToS3 } from "../Funtions/publicnotes"

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
          <Card className="lg:w-[600px] lg:h-[550px]  bg-violet-200 ">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center font-inter text-indigo-950">Notes Exchange</CardTitle>
              <div className="text-base text-gray-600 text-center">Post Notes for your friends .... </div>
            </CardHeader>
            <CardContent>
              <div className="grid lg:gap-10 lg:grid-cols-2 ">
                <div>
                  <Card className="lg:w-[300px] bg-transparent border-transparent shadow-none h-[300px]">
                    <h1 className=" text-center pt-2 font-semibold">Requests by other students</h1>
                    <CardContent className="pt-4">
                    <ScrollArea className=" lg:h-[150px] rounded-sm text-dark-4  p-2">
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
                     className="text-sm"  placeholder="Make requests"/>
                    <Button variant={"ghost"} onClick={handleAddEvent}>Post</Button>
                    </CardFooter>
                  </Card>
                </div>
                <div >
                <Card className="w-[250px]  bg-rose-100  h-[200px]">
                  <h1 className="text-center pt-2 font-semibold text-black">Public Posts</h1>
                  <ScrollArea>
                     <Card className="bg-transparent shadow-none border-transparent mx-4 pt-5">
                       <PdfList/>
                     </Card>
                     </ScrollArea>
                </Card>
              </div>
              </div>
              
            </CardContent>
            <CardFooter className="place-content-center">
            <FileUpload/>
            </CardFooter>
          </Card>
          </div>
        </>
    )
};


export const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
          setFile(event.target.files[0]);
          setFileName(event.target.files[0].name.replace(/\.[^/.]+$/, "")); // Default to file's original name without extension
      }
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFileName(event.target.value);
  };

  const handleUpload = async () => {
      if (!file) {
          alert("Please select a file to upload.");
          return;
      }

      if (!fileName.trim()) {
          alert("Please provide a file name.");
          return;
      }

      setUploading(true);
      try {
          // Create a new file name by appending the original extension
          const newFileName = `${fileName.trim()}.${file.name.split(".").pop()}`;
          const fileWithNewName = new File([file], newFileName, { type: file.type });

          // Upload the file to S3
          const url = await uploadPdfToS3(fileWithNewName);

          // Save the URL and file name to DynamoDB
          await savePdfUrlToDynamoDB(Date.now().toString(), url, fileName); 

          alert("File uploaded successfully!");
      } catch (error) {
          alert("Failed to upload file");
      } finally {
          setUploading(false);
      }
  };

  return (
      <div>
          <Dialog>
              <DialogTrigger>
                  <Button>Make a Post</Button>
              </DialogTrigger>
              <DialogContent className="grid grid-cols-1 justify-items-center bg-fuchsia-100">
                  <Input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                  />
                  {file && (
                      <div>
                          <label>
                              File Name:
                              <Input
                                  type="text"
                                  value={fileName}
                                  onChange={handleFileNameChange}
                                  placeholder="Enter file name"
                              />
                          </label>
                      </div>
                  )}
                  <Button onClick={handleUpload} disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload PDF"}
                  </Button>
              </DialogContent>
          </Dialog>
      </div>
  );
};

export const PdfList: React.FC = () => {
  const [pdfs, setPdfs] = useState<{ id: string; url: string; fileName: string }[]>([]);

  useEffect(() => {
      const fetchPdfs = async () => {
          const data = await fetchPdfUrlsFromDynamoDB();
          setPdfs(data);
      };
      fetchPdfs();
  }, []);

  return (
    <>
   {pdfs.length>0 ? (<ul>
        
        {pdfs.map((pdf) => (
            <li key={pdf.id}>
              {pdf.fileName} -
                <a href={pdf.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                   View pdf 
                </a>
            </li>
        ))}
    </ul>):(<div className=" text-sm">Sry No posts yet</div>)}
   </>
      
  );
};
