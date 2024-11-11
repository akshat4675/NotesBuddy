import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import "@/globals.css";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSubjects, deleteDataFromDynamoDB, uploadDataToDynamoDB } from "../Funtions/fileupload";

const AssignmentManager : React.FC = () => {
    const [uploadedItems, setUploadedItems] = useState<Array<{ subjectName: string; unitName: string; pdfUrl: string; fileName: string }>>([]);
    const [selectedItemToDelete, setSelectedItemToDelete] = useState<string | null>(null);
    
    const userId = sessionStorage.getItem('userSub');
    if (!userId) {
      return <p>Please log in to manage content.</p>;
    }
  
    useEffect(() => {
      fetchUploadedItems();
    }, []);
  
    const fetchUploadedItems = async () => {
      try {
        const subjects = await fetchSubjects();
        setUploadedItems(subjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const handleDelete = async () => {
      if (!selectedItemToDelete) {
        alert('Please select an item to delete');
        return;
      }
  
      const [subject, unit, fileName] = selectedItemToDelete.split('|');
  
      try {
        await deleteDataFromDynamoDB({ subjectName: subject, unitName: unit, fileName });
        alert('Delete successful');
        await fetchUploadedItems(); // Refresh uploaded items after deletion
        setSelectedItemToDelete(null); // Clear selected item
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Failed to delete data');
      }
    };
  
    return (
      <div className="grid justify-center pt-6 bg-transparent ">
        <div className="text-center ">
          
          <Card className='bg-slate-500 text-center bg-opacity-20 p-6 rounded-lg shadow-md max-w-xl mx-auto'>
            <CardHeader>
              <CardTitle>
              <h1 className="text-2xl pb-5 text-slate-950">Your Assignments</h1>
              </CardTitle>
            </CardHeader>
            <div className='space-y-4'>
              <NotesCard uploadedItems={uploadedItems} />
              <AddNotesDialog refreshItems={fetchUploadedItems} />
              <div className='pt-4'>
                <select
                  className='w-full bg-white bg-opacity-20 p-2 rounded-lg text-center'
                  value={selectedItemToDelete || ''}
                  onChange={(e) => setSelectedItemToDelete(e.target.value)}
                >
                  <option value="" disabled>Select a PDF</option>
                  {uploadedItems.map((item, index) => (
                    <option key={index} value={`${item.subjectName}|${item.unitName}|${item.fileName}`}>
                      {`${item.fileName}`}
                    </option>
                  ))}
                </select>
                <Button variant="ghost" className='text-black hover:bg-teal-950 hover:text-white text-sm mt-2 w-full' onClick={handleDelete}>
                  Delete! 
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };
  
  function AddNotesDialog({ refreshItems }: { refreshItems: () => void }) {
    const [subjectName, setSubjectName] = useState('');
    const [unitName, setUnitName] = useState('');
    const [, setFileName] = useState('');
    const [file, setFile] = useState<File | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      setFile(selectedFile);
    };
  
    const handleUpload = async () => {
      if (!file || !subjectName || !unitName) {
        alert('Please fill in all fields and select a file to upload');
        return;
      }
  
      try {
        await uploadDataToDynamoDB({ subjectName, unitName, file });
        alert('Upload successful');
        resetForm();
        await refreshItems(); // Refresh uploaded items after uploading
      } catch (error) {
        console.error('Error uploading data:', error);
        alert('Failed to upload data');
      }
    };
  
    const resetForm = () => {
      setSubjectName('');
      setUnitName('');
      setFile(null);
      setFileName('');
    };
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-1/2 bg-teal-950 text-white font-semibold hover:bg-blue-950 rounded-lg px-4 py-2">
            <Plus className="mr-2" /> Add Notes
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md items-center p-6">
          <DialogHeader>
            <DialogTitle className="text-black text-xl font-semibold">Create Assignments</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <Input type="text" placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className='bg-slate-300 text-teal-950 font-bold bg-opacity-10' />
            <Input type="text" placeholder="Unit Name" value={unitName} onChange={(e) => setUnitName(e.target.value)} className='bg-slate-300 text-teal-950 font-bold bg-opacity-10' />
            <Input type="file" onChange={handleFileChange} className='bg-slate-300 text-teal-950  bg-opacity-10' />
          </div>
          <DialogFooter className='pt-4'>
            <Button onClick={handleUpload} className="bg-teal-950 hover:bg-blue-700 text-white w-full">Upload</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-full ">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  interface NoteItem {
    subjectName: string;
    unitName: string;
    pdfUrl: string;
    fileName: string;
  }
  
  function NotesCard({ uploadedItems }: { uploadedItems: NoteItem[] }) {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  
    // Extract unique subjects from uploaded items
    const uniqueSubjects = Array.from(new Set(uploadedItems.map(item => item.subjectName)));
  
    // Filter items by the selected subject
    const filteredItems = uploadedItems.filter(item => item.subjectName === selectedSubject);
  
    const openDialog = (subject: string) => {
      setSelectedSubject(subject);
      setIsDialogOpen(true);
    };
  
    const closeDialog = () => {
      setIsDialogOpen(false);
      setSelectedSubject(null);
    };
  
    return (
      <div className='bg-white bg-opacity-30 rounded-lg shadow-md p-4'>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Subjects</h3>
        
          <div className=''>
  
            <Card className='h-auto bg-white bg-opacity-10 flex-auto '>
          {uniqueSubjects.map((subject, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-auto text-xl bg-transparent  text-center items-center"
              onClick={() => openDialog(subject)}
            >
              <span>{subject}</span>
              
            </Button>
          ))}
          </Card>
        </div>
  
        {/* Dialog for displaying notes by subject */}
        {selectedSubject && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl text-gray-800 text-center font-bold">{selectedSubject} Notes</DialogTitle>
                <h2 className='text-slate-900 text-lg text-center'>Units</h2>
              </DialogHeader>
              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  <ul className="space-y-3">
                    {filteredItems.map((item, index) => (
                      <li key={index} className="text-gray-800">
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button  className="w-full text-xl items-center text-center p-2 text-teal-950 bg-gray-200">
                              <span>{item.unitName}</span>
                              
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 py-2 text-sm text-gray-700">
                            <div>
                              <strong>File:</strong> {item.fileName} - <a href={item.pdfUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View PDF</a>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No notes available for this subject.</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={closeDialog}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  } 

export default AssignmentManager;