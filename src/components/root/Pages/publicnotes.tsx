import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog,DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import "@/globals.css"

export function Publicnotes (){
    return(
        <>
        <div className="justify-items-center  lg:pr-10">
          <Card className="lg:w-[600px] h-[450px]  bg-violet-200 ">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center font-inter text-indigo-950">Notes Exchange</CardTitle>
              <div className="text-base text-gray-600 text-center">Post Notes for your friends .... </div>
            </CardHeader>
            <CardContent>
              
              <div className="flex gap-2">
                
              </div>
            </CardContent>
            <CardFooter className="grid items-center grid-cols-1 ">
            <Dialog>
                <DialogTrigger>
                    <Button>Make a Post</Button>
                </DialogTrigger>
                <DialogContent className="grid grid-cols-1 justify-items-center bg-fuchsia-100">
                    <div className="text-center text-xl font-bold  text-teal-950">Post public Notes  </div>
                <div >
                <h1 className="text-black">Topic Name</h1>
                <Input type="text" placeholder="Topic Name"/>
                <Input type="file" className="mt-2"/>
                 <Button className="mt-2 ">Post</Button>
                 </div>
                </DialogContent>
            </Dialog>
            </CardFooter>
          </Card>
          </div>
        </>
    )
};