// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import '@/globals.css'
import LoginPage from "./components/auth/loginPage" 
import ConfirmPage from "./components/auth/confirmPage"
import HomePage from "./components/root/Pages/homePage"
import StudyMaterialsPage from './components/root/Pages/study-materials';
import SchedulePage from './components/root/Pages/schedule';



const App = () => {

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return !!accessToken;
  };

  return (
    <BrowserRouter>
    <Routes>
      <Route element={isAuthenticated() ? <Navigate replace to="/home" /> : <Navigate replace to="/login" />}  path="/"></Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route path="/home" element={isAuthenticated() ? <HomePage /> : <Navigate replace to="/login" />} />
      <Route path="/studymaterials" element={isAuthenticated() ? <StudyMaterialsPage /> : <Navigate replace to="/login" />} />
      <Route path="/schedule" element={isAuthenticated() ? <SchedulePage /> : <Navigate replace to="/login" />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;
