import "@/globals.css";
import {  NotebookPen, Menu,ChevronDown, ChevronRight, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { DialogHeader, DialogFooter } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { getSubjects, addSubject, getUnits, addUnit } from "../Funtions/PdfuploadF";
import { SideBar, SidePanel } from "../comps/sidebar";


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

  

  return (
    <>
    <div className="h-screen">
      
    <header className="fixed top-0 left-0 right-0 h-16 bg-transparent  z-10 flex items-center justify-center">
      <div className="flex  items-center space-x-2">
          <NotebookPen className="size-9 text-blue-600 " />
          <h1 className="lg:text-4xl text-3xl font-bold text-sky-950 ">StudyBuddy</h1>
      </div>
      <Sheett/>
         
        </header>
        <div className="pt-16">
        <div >
        <SideBar/>
        </div>
        </div>
        <div className="lg:justify-items-center pt-16 grid grid-cols-1">
          <div>
            <Card className=" lg:w-[700px]  bg-white text-center bg-opacity-10  ">
              <StudyMaterialsCard/>
            </Card>
          </div>
          
        </div> 
        </div>  
    </>
  );
};

const StudyMaterialsCard =()=> {


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

  return(
    <>
      <div className="grid md:grid-cols-1 ">
        <div className=" justify-items-center">
        <h1 className="text-4xl font-bold pt-10 text-blue-950 ">Study Materials</h1>
        <h2 className="text-m pb-5 text-blue-950">Your Subjects and units </h2>
        {loading ? (
        <p>Loading subjects...</p>
        ) : (
        <>
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </>
        )}
         <div className="pt-9 pb-3">
        <AddSubjectDialog onAddSubject={handleAddSubject} />
        </div>
      </div>
      </div>
    </>
  )
}

//PDf notes Subjectcard
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
      <div className="pt-2">
    <Card className="bg-transparent border-transparent  justify-items-center">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className=" text-xl hover:bg-transparent font-extrabold text-teal-950 justify-between items-center">
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
                      <li className="flex items-center gap-2 pt-5 ">
                      <AddUnitDialog onAddUnit={handleAddUnit} />
                      </li>
                    </ul>
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>  
    </Card>
    </div>
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

function Sheett(){
  return (
    <Sheet>
          <SheetTrigger asChild>
           <Button variant="secondary" className="lg:hidden bg-transparent hover:bg-sky-100  ">
           <Menu className=" text-blue-950 " />
           </Button>
          </SheetTrigger> 
          <SheetContent side="left" className=" bg-black h-full w-auto overflow-hidden ">
           <SidePanel/>
          </SheetContent>
        </Sheet>
  )
}

export default StudyMaterialsPage;