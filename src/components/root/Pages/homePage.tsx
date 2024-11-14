import "@/globals.css";

import {SideBar} from "../comps/sidebar";
import { Head } from "../comps/header";
import { Calendar, ChartLine, Dot,  } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "../comps/footer";


const HomePage = () => {

  const navigate = useNavigate();

  const schedul =()=>{
    navigate('/schedule');
  }
  const studymaterials =()=>{
    navigate('/studymaterials');
  }

  return (
      <>
         <div>
          <Head/>
        <SideBar/>
        </div>
        <div className="grid grid-cols-1 gap-4 lg-mx-0 mx-3">
        <div>
        <Card className="bg-transparent border-transparent shadow-none">
        <h1 className="text-3xl font-bold font-inter lg:pt-16  lg:pl-40 pt-5 text-black">Welcome to NotesVerse</h1>
        <h2 className=" lg:pl-40 font-bold text-2xl pt-5 text-black"><span className="text-5xl font-inter text-orange-600">One Place</span> to organize your Education & Time </h2>
        <h3 className="lg:pl-40 font-semibold pt-6 text-gray-800 ">Tame the chaos of your academic life with <span className="font-bold text-xl text-orange-600">NotesVerse</span></h3>
        </Card>
        </div>
        <div className="lg:place-self-center lg:pl-24">
          <Card className="bg-gray-400 bg-opacity-20 border-transparent lg:w-[900px]">
            <CardHeader>
              <CardTitle className="flex">
               <h1 className="text-base font-bold">Get started now and turn your study goals into achievements.</h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex ">
        <div className=" ">
        <span className="flex"><Dot className="size-6 text-blue-950"/></span>
        </div>
        <h1 className="flex text-black">Streamline Your Study Plan:<br/>
          Create, track, and manage your Notes, tasks, assignments, and deadlines all in one place.</h1>
        </div>
        
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 pt-2 lg:mx-40">
          <div>
            <Card className="bg-transparent lg:mx-16 border-transparent shadow-none">
              <CardContent>
              <Button onClick={schedul} variant="ghost" className=" text-teal-950 mt-1 lg:text-xl w-full lg:justify-start" >
                  <Calendar className="h-5 w-5" /> 
                  Personal Organizer
                  
                </Button>
                <img src="https://testbucket4675.s3.ap-south-1.amazonaws.com/FrontendImgs/scheduleandtodos.jpg" onClick={schedul} className=" hover:contrast-50 rounded-xl shadow-xl"/>
              
              </CardContent>
            </Card>
          </div>
          <div>
          <Card className="bg-transparent lg:mx-16 border-transparent shadow-none">
              <CardContent>
              <Button onClick={studymaterials} variant="ghost" className=" text-teal-950 mt-1 lg:text-xl w-full lg:justify-start">
                  <Calendar className="h-5 w-5" /> 
                  Study Organizer
                </Button>
                <img src="https://testbucket4675.s3.ap-south-1.amazonaws.com/FrontendImgs/notes%26assignments.png" onClick={studymaterials} className=" hover:contrast-50 rounded-xl shadow-xl"/>
              </CardContent>
            </Card>
          </div>
          <div className="lg:pl-32 pb-2 grid grid-cols">
            <Card className="lg:size-[800px] bg-gray-400 bg-cover bg-opacity-50 ">
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
            <div className="grid gap-10 grid-cols-1 pt-5 mx-24">
              <div>
                <Card className="bg-slate-600 h-[150px] border-transparent bg-opacity-50">
                 <CardContent>
                         <h1 className="text-center pt-4 font-bold font-sans">Simplicity at its Core</h1>
                         <Card className="h-[5px] mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-base pt-2">Our intuitive design ensures you spend more time learning and less time figuring out how to organize.  </h2>
                 </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-slate-600 h-[150px] border-transparent bg-opacity-50">
                <CardContent>
                         <h1 className="text-center pt-4 font-bold font-sans">Tailored for Students</h1>
                         <Card className="h-[5px] mt-2 border-transparent bg-orange-600 "></Card>
                         <h2 className="text-base pt-2">Built with students in mind, NotesVerse seamlessly adapts to your schedule, deadlines, and priorities.</h2>
                 </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-slate-600 h-[150px] border-transparent bg-opacity-50">
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