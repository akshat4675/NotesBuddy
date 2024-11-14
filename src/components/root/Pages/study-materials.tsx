import "@/globals.css";
import { SideBar} from "../comps/sidebar";
import ManageContent from "./NotesManager";
import { Head } from "../comps/header";
import AssignmentManager from "./AssignmentManager";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card } from "@/components/ui/card";

const StudyMaterialsPage = () => {

  return (
    <>
     <div   >
      <div>
      <Head />
      <SideBar />
      </div>
       
      <div className="lg:justify-items-center pt-2">
          <Card className="bg-slate-400 lg:w-[900px] bg-opacity-20 border-transparent">
        <Tabs defaultValue="notes">
        <TabsList className="mb-4">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="todos">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <div >
        <ManageContent/>
        </div>
        </TabsContent>
        <TabsContent value="todos">
        <div>
        <AssignmentManager/>
        </div>
        </TabsContent>
        </Tabs>
        </Card> 
          </div>
       
        
        </div>  
       
    </>
  );
};




export default StudyMaterialsPage;