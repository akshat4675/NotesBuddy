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
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Discuss } from "./discuss";

const HomePage = () => {
  const [ref, inView] = useInView({
     // Animation triggers only once
    threshold: 0.3,    // Trigger when 30% of the card is visible
  });

  const springAnimation = {
    hidden: { opacity: 0, y: 200 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };
  const slideInright = {
    hidden: { opacity: 0, x: 300 }, // Start off-screen to the right
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

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
          <motion.div ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={springAnimation}>
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
          </motion.div> 
          <motion.div ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={slideInright}>
            <Card className="bg-rose-300 rounded-xl lg:w-[500px] lg:my-6 h-[700px] lg:h-[550px] border-transparent">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center font-inter text-slate-700">Time Organizer</CardTitle>
            </CardHeader>
            <Schedule/>
            </Card>
          </motion.div>
        </div>
       
        <div className="grid grid-cols-2 gap-20 lg:pl-44 pt-10 lg:pr-28 ">
          <div className="pl-20">
            <Publicnotes/>
          </div>
          <div >
            <Card className="w-[400px] bg-emerald-200  h-[400px]">
                    <Discuss/>   
            </Card>
          </div>
        </div>
          
        <div className="grid grid-cols-2 pt-2  lg:mx-40">
         
          <div className="lg:pl-24 lg:mx-10  pb-16 lg:pt-20 grid grid-cols">
            <Card className="lg:size-[800px] w-[350px] h-auto bg-gray-400 bg-cover bg-opacity-50 ">
            <CardHeader>
              
              <CardTitle className=" text-center pt-5 text-sm font-semibold font-inter text-orange-600">
              <div className=" ">
        <div className="h-1 pb-4 bg-primary rounded-full flex items-center justify-center">
        <span className=""><ChartLine className="size-4 text-blue-900"/></span>
        </div>
        <h1 className="">Why Choose Us</h1>
        </div>
                </CardTitle>
            </CardHeader>
            <div className="grid lg:gap-10 mx-5 gap-10 grid-cols-1 pt-5 lg:mx-24">
              <div>
                <Card className="bg-slate-600 lg:h-[150px] h-auto border-transparent bg-opacity-50">
                 <CardContent>
                         <h1 className="text-center pt-4 font-bold font-sans">Simplicity at its Core</h1>
                         <Card className="lg:h-[5px]  mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-base pt-2">Our intuitive design ensures you spend more time learning and less time figuring out how to organize.  </h2>
                 </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-slate-600 lg:h-[150px] h-auto border-transparent bg-opacity-50">
                <CardContent>
                         <h1 className="text-center pt-4 font-bold font-sans">Tailored for Students</h1>
                         <Card className="h-[5px] mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-base pt-2">Built with students in mind, NotesVerse seamlessly adapts to your schedule, deadlines, and priorities.</h2>
                 </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-slate-600 lg:h-[150px] h-auto border-transparent bg-opacity-50">
                <CardContent>
                         <h1 className="text-center pt-4 font-bold font-sans">Accessible Anywhere, Anytime</h1>
                         <Card className="h-[5px] mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-base pt-2">Whether on your laptop or phone, your study plan goes wherever you do.</h2>
                 </CardContent>
                </Card>
              </div>
            </div>
            
              <div className=" pt-5 text-sm text-orange-600"><h1 className="text-center">Follow us</h1></div> 
           
            </Card>
          </div>
        </div>
        </div>
        <Footer/>
      </>
  )
};





export default HomePage;