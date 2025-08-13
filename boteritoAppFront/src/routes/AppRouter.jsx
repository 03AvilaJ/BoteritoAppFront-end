import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegistrarObra from '../pages/RegistrarObra';
import RegistrarUsuario from '../pages/RegistrarUsuario';
import Login from '../pages/Login';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/registrar" element={<RegistrarObra />} />
         <Route path="/RegistrarUsuario" element={<RegistrarUsuario />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
