import { Card, CardContent, CardTitle } from "@/components/ui/card"
import "@/globals.css"


export function Footer(){
    return(
        <>
        <div className="bg-zinc-900 bg-opacity-60 lg:w-full lg:h-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 lg:mx-60">
        <div>
            <Card className="bg-transparent border-transparent pt-2 lg:h-36">
           
                <CardTitle className="text-base pl-5 lg:pl-6 text-teal-50">About us</CardTitle>
          
             <CardContent>
                <h3 className="flex text-xs text-teal-50  ">we’re passionate about empowering students to achieve their goals with ease. Our mission is to simplify the way you plan, organize, and track your studies.</h3>
             </CardContent>
            </Card>
        </div>
        <div>
        <Card className="bg-transparent border-transparent  pt-2 lg:pl-40 lg:h-32">
           
           <CardTitle className="text-sm pl-5 lg:pl-6 text-teal-50">Contact Us</CardTitle>
     
        <CardContent>
           <h3 className="text-xs text-teal-50 ">NotesVerse.study@gmail.com<br/>Pune , Maharashtra</h3>
        </CardContent>
       </Card>
        </div>
        </div>
    
        </div>
        </>
    )
}