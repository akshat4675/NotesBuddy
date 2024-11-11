import "@/globals.css";
import { SideBar} from "../comps/sidebar";
import ManageContent from "./NotesManager";
import { Head } from "../comps/header";
import AssignmentManager from "./AssignmentManager";

const StudyMaterialsPage = () => {

  return (
    <>
    <div className="h-screen">
      <div>
      <Head />
      <SideBar />
      </div>
      <div>
      <h1 className="text-4xl font-bold pt-3 text-center text-teal-950">Study Materials</h1>
      </div>
        <div className="lg:justify-items-center grid  lg:grid-cols-2 ">
        <div className="lg:pl-40">
        <ManageContent/>
        </div>
        <div className="lg:pr-40">
        <AssignmentManager/>
        </div>
        </div> 
        </div>  
    </>
  );
};




export default StudyMaterialsPage;