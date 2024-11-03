import "../globals.css";
import { House, LogOut, NotebookPen, Menu, Calendar, Bell, BookOpen, ChevronDown, ChevronRight, FileText, Plus } from "lucide-react";
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
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <SideBarfunction />
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
        <header className="bg-black shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-semibold">Study Materials</h1>
            <Button variant="ghost" size="icon">
              <Bell className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <div className="p-6">
        <>
        <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Materials</h1>
        <AddSubjectDialog onAddSubject={handleAddSubject} />
      </div>
      {loading ? (
        <p>Loading subjects...</p>
      ) : (
        <div className="grid gap-4">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
        </>
        </div>
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
    <Card>
      <CardHeader>
        <CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-between items-center">
                <span>{subject.name}</span>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                        <li key={unit.id} className="flex items-center gap-2">
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
                    </ul>
                    <AddUnitDialog onAddUnit={handleAddUnit} />
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
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
        </form>
      </DialogContent>
    </Dialog>
  );
}


function SideBarfunction() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const home = () => {
    navigate('/home');
  };

  const schedul = () => {
    navigate('/schedule');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-center h-16 border-b">
        <NotebookPen className="h-6 w-6 text-blue-600" />
        <span className="ml-2 text-xl font-semibold">StudyBuddy</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          <li>
            <Button onClick={home} variant="ghost" className="w-full justify-start">
              <House className="mr-2 h-4 w-4" />
              Home
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
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}



export default StudyMaterialsPage;