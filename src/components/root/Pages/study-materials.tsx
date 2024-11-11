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