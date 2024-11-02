import "../globals.css";
import { House, LogOut, NotebookPen, Menu, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";



const StudyMaterialsPage = () => {

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
      
    </div>
  );
};


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
