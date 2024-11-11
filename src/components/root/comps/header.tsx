import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import "@/globals.css";
import { Menu, NotebookPen } from "lucide-react";
import { SidePanel } from "./sidebar";

export function Head()
{
    return (
        <>
        <header className="flex items-center justify-between p-4 bg-opacity-40 lg:bg-opacity-80 bg-sky-200 shadow-md">
        <div className="flex items-center space-x-4">
        <div className="w-full h-1 bg-primary rounded-full flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-xl"><NotebookPen className="size-9 text-blue-600"/></span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-teal-950">StudyBuddy</h1>
        </div>
        <Sheett/>
        </header>
        </>
    )
}

function Sheett(){
    return (
      <Sheet>
            <SheetTrigger asChild>
             <Button variant="secondary" className="lg:hidden bg-transparent   hover:bg-sky-100  ">
             <Menu className=" text-blue-950 " />
             </Button>
            </SheetTrigger> 
            <SheetContent side="left" className=" bg-black h-full w-auto overflow-hidden ">
             <SidePanel/>
            </SheetContent>
          </Sheet>
    )
  }