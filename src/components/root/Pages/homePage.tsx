import "@/globals.css";
import { Head } from "../comps/header";
import { ChartLine } from "lucide-react";
import { Card, CardContent,  CardHeader,  CardTitle } from "@/components/ui/card";
import { Footer } from "../comps/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssignmentManager from "./AssignmentManager";
import ManageContent from "./NotesManager";
import Schedule from "./schedule";
import {Publicnotes} from "./publicnotes";
import {Rocket} from "./rocket";



const HomePage = () => {

  return (
      <>
         <div>
          <Head/>
        </div>
        
        <div className="grid grid-cols-1 gap-4 pt-10 lg-mx-0 mx-3">
        
        <div>
        <Card className="bg-transparent lg:pb-20 lg:pt-6 border-transparent shadow-none">
        <h1 className="text-4xl font-bold font-inter lg:pt-16  lg:pl-40  text-cyan-50">Welcome to NotesVerse</h1>
        <h2 className=" lg:pl-40 font-bold text-2xl pt-5 font-mono text-cyan-50"><span className="text-5xl font-inter text-orange-600">One Place</span> to organize your Education & Time </h2>
        <h3 className="lg:pl-40 font-semibold font-base font-mono pt-6 text-gray-300 ">Tame the chaos of your academic life with <span className="font-bold text-xl text-orange-600">NotesVerse</span></h3>
        </Card>
        </div>
        <div className="grid lg:grid-cols-2  gap-10 pt-10 lg:mx-40" >
          <div>
          <Card  className="bg-cyan-100 rounded-xl lg:w-[500px]  h-[700px] lg:h-[600px]  border-transparent">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center font-inter text-slate-800">Study Organizer</CardTitle>
            </CardHeader>
        <Tabs defaultValue="notes">
        <TabsList className="mb-4 ml-5 bg-slate-800 shadow-violet-300  shadow-sm">
        <TabsTrigger  value="notes" className="text-sm text-white">Notes</TabsTrigger>
        <TabsTrigger value="todos" className="text-sm text-white">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <div className="mx-2" >
        <ManageContent/>
        </div>
        </TabsContent>
        <TabsContent value="todos">
        <div className="mx-2">
        <AssignmentManager/>
        </div>
        </TabsContent>
        </Tabs>
        </Card> 
        </div> 
        <div> 
            <Card className="bg-rose-300 rounded-xl lg:w-[500px] lg:my-6 h-[700px] lg:h-[550px] border-transparent">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center font-inter text-slate-700">Time Organizer</CardTitle>
            </CardHeader>
            <Schedule/>
            </Card>
          </div>
        </div>
       
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-20 lg:pl-44 pt-10 lg:pr-28 ">
          <div className="lg:pl-20">
            <Publicnotes/>
          </div>
          <div >
            <Card className="lg:w-[400px] bg-amber-200 h-[400px]">
              <CardHeader>
                <CardTitle className="font-bold text-dark-4 pt-2">Don't forget to park the Rocket</CardTitle>
              </CardHeader>
            <Rocket/>
            </Card>
          </div>
        </div>
          
        <div className="grid grid-cols-1 pt-2 lg:mx-40">
         
          <div className="lg:pl-24 lg:mx-10 pb-16  lg:pt-20 grid grid-cols">
            <Card className="lg:size-[800px]  h-auto bg-gradient-to-r from-indigo-500  to-pink-500 bg-cover bg-opacity-20 ">
            <CardHeader>
              
              <CardTitle className=" text-center pt-5 text-md font-semibold font-inter text-black">
              <div className=" ">
        <div className="h-1 pb-4 bg-primary rounded-full flex items-center justify-center">
        <span className=""><ChartLine className="size-7 text-orange-600"/></span>
        </div>
        <h1 className="">Why Choose Us</h1>
        </div>
                </CardTitle>
            </CardHeader>
            <div className="grid lg:gap-10 mx-4 gap-10 grid-cols-1 pt-5 lg:mx-24">
              <div>
                <Card className="bg-slate-900 lg:h-[150px] h-auto border-transparent bg-opacity-70">
                 <CardContent>
                         <h1 className="text-center bg-slate-900pt-4 pt-2 text-off-white font-bold font-sans">Simplicity at its Core</h1>
                         <Card className="lg:h-[5px]  mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-sm text-off-white pt-2">Our intuitive design ensures you spend more time learning and less time figuring out how to organize.  </h2>
                 </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-slate-900 lg:h-[150px] h-auto border-transparent bg-opacity-70">
                <CardContent>
                         <h1 className="text-center pt-2 font-bold text-off-white font-sans">Tailored for Students</h1>
                         <Card className="h-[5px] mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-sm text-off-white pt-2">Built with students in mind, NotesVerse seamlessly adapts to your schedule, deadlines, and priorities.</h2>
                 </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-slate-900 lg:h-[150px] h-auto border-transparent bg-opacity-70">
                <CardContent>
                         <h1 className="text-center pt-2 text-off-white font-bold font-sans">Accessible Anywhere, Anytime</h1>
                         <Card className="h-[5px] mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-sm text-off-white pt-2">Whether on your laptop or phone, your study plan goes wherever you do.</h2>
                 </CardContent>
                </Card>
              </div>
            </div>
            
              <div className=" pt-5 text-lg font-bold text-black"><h1 className="text-center">Follow us</h1></div> 
           
            </Card>
          </div>
        </div>
        </div>
        <Footer/>
      </>
  )
};





export default HomePage;