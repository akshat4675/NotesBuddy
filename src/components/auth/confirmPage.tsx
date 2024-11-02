// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmSignUp } from './authService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LogOut} from "lucide-react"
import "../globals.css";

const confirmPage = () => {
  
  

  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line
  const [email, setEmail] = useState(location.state?.email || '');
  const [confirmationCode, setConfirmationCode] = useState('');
  
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, confirmationCode);
      alert("Account confirmed successfully!\nSign in on next page.");
      navigate('/login');
    } catch (error) {
      alert(`Failed to confirm account: ${error}`);
    }
  };
https://v0.dev/chat/3lKd58OeoO3
return (

  <div className="flex items-center justify-center min-h-screen bg-slate-800">
    <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Confirm Account</CardTitle>
          <CardDescription className="text-center">
            Enter your Credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
      <div className="space-y-2">
        <Label htmlFor="confirmationCode">Confirmation Code</Label>
        <Input
          className="inputText"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Confirmation Code"
          required />
      </div>
      <br></br>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
      <Button type="submit" className="w-full sm:w-1/2">Confirm Account</Button>
        <Button  type="button" variant="outline" className="w-full sm:w-1/2" onClick={handleLogout}>
            <LogOut />
              Return to Sign in
        </Button>
        </CardFooter>
    </form>
    </CardContent>
  </Card>
  </div>
  
);

};

export default confirmPage;