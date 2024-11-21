// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import '@/globals.css'
import LoginPage from "./components/auth/loginPage" 
import ConfirmPage from "./components/auth/confirmPage"
import HomePage from "./components/root/Pages/homePage"

import UserProfile from './components/auth/userprofile';
import EditProfilePage from './components/root/Pages/editProfile';





const App = () => {

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return !!accessToken;
  };


  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Navigate replace to="/home" />}  path="/"></Route>
      <Route path="/User" element={isAuthenticated() ? <UserProfile /> : <Navigate replace to="/login" />} />
      <Route path="/editUser" element={isAuthenticated() ? <EditProfilePage /> : <Navigate replace to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route path="/home" element={  <HomePage /> } />
    </Routes>
    </BrowserRouter>
  );
};

export default App;