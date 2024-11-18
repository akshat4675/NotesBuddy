import React, { useState, useEffect } from "react";
import { fetchUserData, updateUserData } from "../Funtions/userprofile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  useNavigate } from "react-router";

const EditProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch the userId from session storage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userSub");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID not found in session storage.");
    }
  }, []);

  // Fetch user data
  useEffect(() => {
    const getUserData = async () => {
      if (!userId) return;
      setIsLoading(true);
      setError(null);

      try {
        const userData = await fetchUserData(userId);
        setName(userData.name);
        setEmail(userData.email);
        setPhone(userData.phone);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");

        if(err==='Failed to fetch user data: User not found.')
        {
        navigate('/user')
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      getUserData();
    }
  }, [userId]);

  const navigate =useNavigate();
  function home(){
  navigate('/home');
}
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    

    try {
      const result = await updateUserData(userId as string, name, email, phone);
      setMessage(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }

    
  };

  return (
    <div className="flex justify-center items-center h-screen p-5">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center text-black mb-4">Edit Your Profile</h1>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}

        {userId ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-1 text-black border border-gray-380 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-1 border text-black border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 mt-1 border text-black border-gray-300 rounded-md"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant={"ghost"} onClick={home} className="mt-2 w-full text-black text-base">Return home</Button>
          </form>
        ) : (
          <p className="text-gray-500">Loading user information...</p>
        )}
        
      </div>
      
    </div>
  );
};

export default EditProfilePage;
