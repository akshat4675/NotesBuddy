import { Card, CardContent, CardTitle } from "@/components/ui/card"
import "@/globals.css"


export function Footer(){
    return(
        <>
        <div className="bg-orange-800 bg-opacity-60 w-full h-36">
        <div className="grid grid-cols-2 gap-16 mx-60">
        <div>
            <Card className="bg-transparent border-transparent pt-2 h-36">
           
                <CardTitle className="text-base pl-6">About us</CardTitle>
          
             <CardContent>
                <h3 className="flex text-sm ">we’re passionate about empowering students to achieve their goals with ease. Our mission is to simplify the way you plan, organize, and track your studies.</h3>
             </CardContent>
            </Card>
        </div>
        <div>
        <Card className="bg-transparent border-transparent pt-2 h-32">
           
           <CardTitle className="text-base pl-6">Contact Us</CardTitle>
     
        <CardContent>
           <h3 className="flex text-sm">NotesVerse.study@gmail.com <br/>Pune , Maharashtra</h3>
        </CardContent>
       </Card>
        </div>
        </div>
    
        </div>
        </>
    )
}