import "../globals.css";
import { House, LogOut, NotebookPen, Menu, Calendar, ChevronDown, ChevronRight, FileText, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { getSubjects, addSubject, getUnits, addUnit } from "./aws-utils";
import { Tooltip, TooltipContent, TooltipProvider ,TooltipTrigger} from "../ui/tooltip";


type Subject = {
  id: string; // Use 'number' if id is a number
  name: string;
};

type Unit = {
  id: string; // Use 'number' if id is a number
  name: string;
  pdfUrl: string; // URL to the PDF file
};

const StudyMaterialsPage = () => {

   /* Add subject functions */
  
   const { toast } = useToast();
   const [subjects, setSubjects] = useState<Subject[]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     fetchSubjects();
   }, []);
 
   const fetchSubjects = async () => {
     try {
       setLoading(true);
       const fetchedSubjects = await getSubjects();
       setSubjects(fetchedSubjects as Subject[]); // Ensure the correct type
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
 
   const handleAddSubject = async (name: string) => {
     try {
       await addSubject(name);
       await fetchSubjects();
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
      <>
        <div className="pt-16 grid grid-cols-1 gap-2  justify-items-center">
        <div>
        <h1 className="text-5xl font-bold text-blue-950 pt-10">Study Materials</h1>
        <h2 className="text-m pb-5 text-blue-950">Your Subjects and units </h2>
        </div>
        <div className="pr-14 ">
        {loading ? (
        <p>Loading subjects...</p>
        ) : (
        <>
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </>
        )}
        </div>
         <div className="pt-6">
        <AddSubjectDialog onAddSubject={handleAddSubject} />
        </div>
      </div>
      
      </>
      </main>
    </div>
  );
};

const SubjectCard: React.FC<{ subject: Subject }> = ({ subject }) => {
  const { toast } = useToast(); // Ensure toast is accessible
  const [isOpen, setIsOpen] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]); // Specify the type for units
  const [loading, setLoading] = useState(false);

  const fetchUnits = async () => {
    if (isOpen) { // Load units only when open
      try {
        setLoading(true);
        const fetchedUnits = await getUnits(subject.id);
        setUnits(fetchedUnits as Unit[]); // Ensure the correct type
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch units. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddUnit = async (name: string, file: File) => {
    try {
      await addUnit(subject.id, name, file);
      await fetchUnits();
      toast({
        title: "Success",
        description: `Unit "${name}" has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add unit. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [isOpen]);

  return (
    <Card className="bg-transparent bg-white bg-opacity-20 justify-items-center">
      <CardHeader>
        <CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className=" text-3xl hover:bg-transparent font-extrabold text-teal-950 justify-between items-center">
                <span>{subject.name}</span>
                {isOpen ? <ChevronDown className="" /> : <ChevronRight className="" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {loading ? (
                  <p>Loading units...</p>
                ) : (
                  <>
                    <ul className="space-y-2 mb-4">
                      {units.map((unit) => (
                        <li key={unit.id} className=" flex items-center gap-2 pt-5 ">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={unit.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {unit.name}
                          </a>
                        </li>
                      ))}
                      <li className=" flex items-center gap-2 pt-5 ">
                      <AddUnitDialog onAddUnit={handleAddUnit} />
                      </li>
                    </ul>
                    
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

function AddSubjectDialog({ onAddSubject }: { onAddSubject: (name: string) => void }) {
  const [subjectName, setSubjectName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSubject(subjectName);
    setSubjectName('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" bg-white bg-opacity-20 text-xl font-extrabold hover:bg-white text-teal-950">
          <Plus className="" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              className="text-black"
            />
          </div>
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

function AddUnitDialog({ onAddUnit }: { onAddUnit: (name: string, file: File) => void }) {
  const [unitName, setUnitName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onAddUnit(unitName, file);
      setUnitName('');
      setFile(null);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="font-extrabold text-xl hover:bg-transparent bg-transparent border-transparent" size="sm">
          <Plus className="" />
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black">Add New Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="text-black space-y-4">
          <div>
            <Label htmlFor="unitName">Unit Name</Label>
            <Input
              id="unitName"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="Enter unit name"
            />
          </div>
          <div>
            <Label htmlFor="pdfFile">PDF File</Label>
            <Input
              id="pdfFile"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit">Add Unit</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </form>
        
      </DialogContent>
      
    </Dialog>
  );
}

function SideBarfunction2(){
  
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  const studymaterial =()=>
    {
      navigate('/home');
    }
  const schedul =()=>{
    navigate('/schedule');
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
                <Button onClick={studymaterial} variant="ghost" className="  text-sky-200  w-full justify-start">
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


export default StudyMaterialsPage;