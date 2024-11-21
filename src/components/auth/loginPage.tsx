
//Imports 
'use client'
import {  confirmPasswordReset, requestPasswordReset, signIn, signUp } from './authService';
import { Eye, EyeOff, Mail, Lock, BookOpen} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import "@/globals.css";
import { useState } from 'react';
import {  useNavigate } from 'react-router';
import { Dialog, DialogTrigger,DialogContent  } from '@/components/ui/dialog';




export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignIn , setIsSignIn] = useState(false);
  const navigate = useNavigate();


  //SignIn function
  const handleSignIn = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const session = await signIn(email, password);
      console.log('Sign in successful', session);
      if (session && typeof session.AccessToken !== 'undefined') {
        sessionStorage.setItem('accessToken', session.AccessToken);
        if (sessionStorage.getItem('accessToken')) {
          window.location.href = '/home';
        } else {
          console.error('Session token was not set properly.');
        }
      } else {
        console.error('SignIn session or AccessToken is undefined.');
      }
      
    } catch (error) {
      if(error=='UserNotConfirmedException: User is not confirmed.')
        {navigate('/confirm')}
      else 
      alert(`Sign in failed: ${error}`);
      
    }
  };


  //SignUp function

  const handleSignUp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate("/confirm")
      } 
    catch (error) {
      alert(`Sign up failed: ${error}`);

    }
  };

  return (
    <>
    <div className="flex min-h-screen flex-col bg-sky-100 md:flex-row">
      <div className="flex w-full items-center justify-center bg-sky-100  p-8 md:w-1/3">
        <Card className="w-full bg-sky-200 max-w-md">
          <CardHeader>
          <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <BookOpen className="text-primary-foreground text-blue-700 w-7 h-8" />
          </div>
          <span className="text-2xl font-bold">NotesVerse</span>
        </div>
          <CardTitle> <div className=" text-2xl font-bold">{isSignUp ? 'Sign up' : 'Sign in'}<span className=' pl-2 text-sm   text-gray-500'>Enter your Credentials</span></div></CardTitle>
          <CardDescription ></CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-gray-500 pl-10 text-white placeholder:text-black"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-black" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-500 pl-10 text-white placeholder:text-black"
                    required
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-black" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-black" />
                    ) : (
                      <Eye className="h-5 w-5 text-black" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                
              </div>
              
              {isSignUp && (
          <div className="space-y-2">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmpassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-500 pl-10 text-white placeholder:text-black"
              required
            />
            <Lock className="absolute left-3 top-3 h-5 w-5 text-black" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-black" />
              ) : (
                <Eye className="h-5 w-5 text-black" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          <Card>
              <CardContent>
              
                <Label className='text-black text-xs'>Make sure the password has 1  uppercase letter, 1 lowercase letter, 1 number and 1 special character</Label>
              </CardContent>
            </Card>
        </div>
          
        )}
        {isSignIn || ( <div className=''>
        
        <Dialog>
        <DialogTrigger>
          <Button variant={"ghost"} className=''>Reset Password</Button>
        </DialogTrigger>
        <DialogContent className='bg-violet-400'>
          <div>
             <RequestPasswordReset/>
          </div>
        </DialogContent>
      </Dialog>
       </div>  
         ) }
              <Button type="submit" className="w-full bg-rose-400 text-white hover:bg-black">
              {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className='grid grid-cols-1 lg:pl-10 justify-items-center'>
            <div>
          <Button  variant={"ghost"} className="w-full" onClick={() => { setIsSignIn(!isSignIn),setIsSignUp(!isSignUp) }} >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </Button>
      </div>
     
      </div>
          </CardFooter>
         
        </Card>
      </div>
      <div className="hidden w-full md:block md:w-2/3">
        <img
          src="https://testbucket4675.s3.ap-south-1.amazonaws.com/FrontendImgs/study-7217599_1920.jpg"
          alt="Authentication illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
    </>
  )
}

export const RequestPasswordReset: React.FC = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
     
  const handleRequestReset = async () => {
    try {
      await requestPasswordReset(username);
      setMessage("Password reset code sent to your email.");
    } catch (error) {
      setMessage("Error sending password reset request.");
    }
  };

  const handleConfirmReset = async () => {
    try {
      await confirmPasswordReset(username, code, newPassword);
      setMessage2("Password successfully reset. You can now log in.");
    } catch (error) {
      setMessage2("Error confirming password reset.");
    }
  };

  return (
    <div className=' flex-1'>
      <h2 className='mt-2'>Request Password Reset</h2>
      <Input
        className='mt-3'
        type="text"
        placeholder="Enter your username/email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button className='mt-4' onClick={handleRequestReset}>Request Reset</Button>
      <p>{message}</p>
      <div className='flex-1'>
      <h2 className=' m-2'>Confirm Password Reset</h2>
      <Input
      className=' mt-2 '
        type="text"
        placeholder="Enter your username/email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
      className=' mt-3 '
        type="text"
        placeholder="Enter the confirmation code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className='grid grid-cols-1 gap-4'>
      <Input
      className=' mt-2'
        type="password"
        placeholder="Enter your new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Card className='bg-rose-200'>
        <CardContent>
        <Label className='text-black text-xs'>Make sure the password has 1  uppercase letter, 1 lowercase letter, 1 number and 1 special character</Label>
        </CardContent>
      </Card>
      </div>
      <Button  className=' m-2'onClick={handleConfirmReset}>Confirm Reset</Button>
      <p>{message2}</p>
    </div>
    </div>
    
  );
};
