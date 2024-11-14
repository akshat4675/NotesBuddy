import "@/globals.css";

import {SideBar} from "../comps/sidebar";
import { Head } from "../comps/header";
import { Calendar, Dot,  } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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
        <div className="grid grid-cols-1 gap-5 lg-mx-0 mx-3">
        <div>
        <Card className="bg-transparent border-transparent shadow-none">
        <h1 className="text-3xl font-bold lg:pt-16  lg:pl-40 pt-5 text-slate-900">Welcome to NotesVerse</h1>
        <h2 className=" lg:pl-44 font-bold text-2xl pt-5 text-teal-950"><span className="text-5xl">One Place</span> to organize your Education & Time </h2>
        <h3 className="lg:pl-40 font-semibold pt-6 text-slate-600 ">Tame the chaos of your academic life with <span className="font-bold text-xl text-teal-950">NotesVerse</span>, <br/> the ultimate tool for effortless planning and organization. </h3>
        </Card>
        </div>
        <div className="lg:place-self-center  ">
          <Card className="bg-gray-400 bg-opacity-20 border-transparent lg:w-[900px]">
            <CardHeader>
              <CardTitle className="flex">
               <h1 className="text-base">Get started now and turn your study goals into achievements.</h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex ">
        <div className=" ">
        <span className="flex"><Dot className="size-6 text-blue-950"/></span>
        </div>
        <h1 className="flex font-semibold text-slate-600">Streamline Your Study Plan:<br/>
          Create, track, and manage your Notes, tasks, assignments, and deadlines all in one place.</h1>
        </div>
        
        <div className="flex pt-4 text-sm font-bold" > Get started now and turn your study goals into achievements.</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:mx-36">
          <div>
            <Card className="bg-transparent lg:m-5 border-transparent shadow-none">
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
          <Card className="bg-transparent lg:m-5 border-transparent shadow-none">
              <CardContent>
              <Button onClick={studymaterials} variant="ghost" className=" text-teal-950 mt-1 lg:text-xl w-full lg:justify-start">
                  <Calendar className="h-5 w-5" /> 
                  Study Organizer
                </Button>
                <img src="https://testbucket4675.s3.ap-south-1.amazonaws.com/FrontendImgs/notes%26assignments.png" onClick={studymaterials} className=" hover:contrast-50 rounded-xl shadow-xl"/>
              
              </CardContent>
            </Card>
          </div>
          

        </div>
        </div>
      </>
  )
};





export default HomePage;