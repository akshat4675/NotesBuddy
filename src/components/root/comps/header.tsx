import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import "@/globals.css";
import { Menu, NotebookPen } from "lucide-react";
import { SidePanel } from "./sidebar";

export function Head()

{

    return (
        <>
        <header className="flex items-center lg:pl-6 justify-between p-4  bg-transparent shadow-none">
        <div className="flex items-center lg:pt-5 space-x-4">
        <div className="w-full h-1 lg:pl-28  bg-primary rounded-full flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-xl"><NotebookPen className="size-9 text-blue-900"/></span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-teal-950">NotesVerse</h1>
        </div>
        <Sheett/>
        </header>
        </>
    )
}

export function Sheett(){
 

  
    return (
      <div>
      
      <Sheet>
            <SheetTrigger asChild>
             <Button variant="secondary" className="lg:hidden bg-transparent   hover:bg-sky-100  ">
             <Menu className=" text-black " />
             </Button>
            </SheetTrigger> 
            <SheetContent side="left" className=" bg-black h-full w-auto overflow-hidden ">
             <SidePanel/>
            </SheetContent>
          </Sheet>
          </div>
    )
  }