"use client";

import "@/globals.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser } from "./createuser"; // Import the helper function
import { useNavigate } from "react-router";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userSub");
    if (!userId) {
      alert("User ID is missing! Please log in again.");
      return;
    }
    
    setLoading(true);

    try {
      await createUser( userId ,name, email, phone);
      alert("Profile created successfully!");
      // Optionally clear form fields after successful submission
      setName("");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const navigate = useNavigate();

  function home(){
    navigate("/home");
  }

  return (
    <div className="flex items-center justify-center mx-5 pt-5 lg:pt-20">
      <Card className="w-full bg-purple-200 max-w-md">
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>Add some details to personalize your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="bg-slate-200"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="bg-slate-200"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone no.</Label>
              <Input
                id="phone"
                className="bg-slate-200"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-1/2" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
            <Button variant={"default"} onClick={home} className= "bg-white text-black w-1/2 ml-2">Home</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
