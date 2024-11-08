import "@/globals.css";
import { House, LogOut, NotebookPen, Menu, Calendar, ChevronDown, ChevronRight, FileText, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { getSubs, addSub, getAssignments, addAssignment } from "./Funtions/AssignementUploadf"; // Note: Changed getSubjects and addSubject to getSubs and addSub
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Define types for Sub (formerly Subject) and Assignment
type Sub = {
  Id: string;
  name: string;
};

type Assignment = {
  Id: string;
  name: string;
  pdfUrl: string; // URL to the PDF file
};

// Main page component
const AssignmentsPage = () => {
  

  return (
    <>
    <div className="h-screen">
    <header className="fixed top-0 left-0 right-0 h-16 bg-transparent  z-10 flex items-center justify-center">
      <div className="flex  items-center space-x-2">
          <NotebookPen className="size-9 text-blue-600 " />
          <h1 className="text-3xl font-bold text-sky-950 ">StudyBuddy</h1>
      </div>
        <Sheet>
          <SheetTrigger asChild>
           <Button variant="secondary" className="lg:hidden bg-transparent hover:bg-sky-100  ">
           <Menu className=" text-blue-950  " />
           </Button>
          </SheetTrigger> 
          <SheetContent side="left" className=" bg-black h-full w-auto overflow-hidden ">
           <SideBarfunction2/>
          </SheetContent>
        </Sheet>
        </header>
        <div className="pt-16">
        <div className="fixed mx-3 hidden h-5/6 rounded-3xl bg-background w-14 bg-black lg:block" >
        <SideBarfunction/>
        </div>
        </div>
        <div className="lg:justify-items-center pt-16 grid grid-cols-1 ">
          <div>
            <Card className=" lg:w-[700px] md:mx-10 bg-white text-center bg-opacity-10 ">
              <AssignmentsCard/>
            </Card>
          </div>
        </div> 
        </div>
    </>
  );
};

const AssignmentsCard =()=>{

  const { toast } = useToast();
  const [subs, setSubs] = useState<Sub[]>([]);  // Changed subjects to subs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubs(); // Changed fetchSubjects to fetchSubs
  }, []);

  const fetchSubs = async () => {
    try {
      setLoading(true);
      const fetchedSubs = await getSubs();  // Changed getSubjects to getSubs
      setSubs(fetchedSubs as Sub[]);       // Changed setSubjects to setSubs
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subjects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSub = async (name: string) => {  // Changed handleAddSubject to handleAddSub
    try {
      await addSub(name); // Changed addSubject to addSub
      await fetchSubs();
      toast({
        title: "Success",
        description: `Subject "${name}" has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  return(
          <>
          <div className="grid ">
          <div className="justify-items-center">
            <h1 className="text-4xl font-bold pt-10 text-blue-950">Assignments</h1>
            <h2 className="text-m pb-5 text-blue-950">Your assignment questions and deadlines</h2>
            <div className="grid pl-3 lg:grid-cols-4 ">
              {loading ? (
                <p>Loading...</p>
              ) : (
                subs.map((sub) => <SubCard key={sub.Id} sub={sub} />) // Changed SubjectCard to SubCard
              )}
            </div>
            <div className="pt-9 pb-3">
              <AddSubDialog onAddSub={handleAddSub} />
            </div>
          </div>
        </div>
          </>
  )
};

// Sub card component
const SubCard: React.FC<{ sub: Sub }> = ({ sub }) => {  // Changed SubjectCard to SubCard and subject to sub
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssignments = async () => {
    if (isOpen) {
      try {
        setLoading(true);
        const fetchedAssignments = await getAssignments(sub.Id);  // Changed subject.id to sub.id
        setAssignments(fetchedAssignments as Assignment[]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch assignments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddAssignment = async (name: string, file: File) => {
    try {
      await addAssignment(sub.Id, name, file);  // Changed subject.id to sub.id
      await fetchAssignments();
      toast({
        title: "Success",
        description: `Assignment "${name}" has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [isOpen]);

  return (
    <div className="pt-2">
      <Card className="bg-transparent border-transparent justify-items-center">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="text-xl hover:bg-transparent font-extrabold text-teal-950 justify-between items-center">
              <span>{sub.name}</span>
              {isOpen ? <ChevronDown className="" /> : <ChevronRight className="" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {loading ? (
                <p>Loading assignments...</p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {assignments.map((assignement) => (
                        <li key={assignement.Id} className=" flex items-center gap-2 pt-5 ">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={assignement.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {assignement.name}
                          </a>
                        </li>
                      ))}
                  <li className="flex items-center gap-2 pt-5">
                    <AddAssignmentDialog onAddAssignment={handleAddAssignment} />
                  </li>
                </ul>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

// Add Sub Dialog component
function AddSubDialog({ onAddSub }: { onAddSub: (name: string) => void }) {  // Changed AddSubjectDialog to AddSubDialog
  const [subName, setSubName] = useState('');  // Changed subjectName to subName

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSub(subName);  // Changed onAddSubject to onAddSub
    setSubName('');     // Changed setSubjectName to setSubName
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex bg-white bg-opacity-20 text-xl font-extrabold hover:bg-white text-teal-950">
          <Plus className="" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="subName" value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="Enter subject name" className="text-black" />
          <DialogFooter>
            <Button type="submit">Add Subject</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add Assignment Dialog component remains unchanged
function AddAssignmentDialog({ onAddAssignment }: { onAddAssignment: (name: string, file: File) => void }) {
  const [assignmentName, setAssignmentName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onAddAssignment(assignmentName, file);
      setAssignmentName('');
      setFile(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="font-extrabold bg-white bg-opacity-30 text-teal-950">
          <Plus />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Add Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="assignmentName" className="text-teal-950">Assignment Name</Label>
          <Input id="assignmentName" value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} placeholder="Enter assignment name" className="text-black" />
          <Label htmlFor="file" className="text-teal-950">Upload PDF</Label>
          <Input id="file" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-black" />
          <DialogFooter>
            <Button type="submit">Add Assignment</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
//Function for both the sideBars
function SideBarfunction2(){
  
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
  const home =()=>
    {
      navigate('/home');
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
                <Button onClick={schedul} variant="ghost" className=" text-sky-200   w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" /> 
                  Schedule
                </Button>
              </li>
              <li>
                <Button onClick={studymaterial} variant="ghost" className="  text-sky-200  w-full justify-start">
                  <BookOpen  className="mr-2 h-4 w-4" />
                  
                  Study Materials
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
  const schedul =()=>{
    navigate('/schedule');
  }
  const studymaterial =()=>
    {
      navigate('/studymaterials');
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
                <Button onClick={schedul} variant="ghost" className=" text-sky-200 justify-start">
                  <Calendar className=" h-2 w-2" /> 
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Schedule</p>
                </TooltipContent>
              </Tooltip>
              </TooltipProvider>
              </li>
              <li>
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button onClick={studymaterial} variant="ghost" className=" text-sky-200 justify-start">
                  <BookOpen className=" h-2 w-2" /> 
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Study Materials</p>
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

export default AssignmentsPage;
