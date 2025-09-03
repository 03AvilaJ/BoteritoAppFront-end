import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegistrarObra from '../pages/RegistrarObra';
import RegistrarUsuario from '../pages/RegistrarUsuario';
import AdminObras from '../pages/AdminObras';
import Login from '../pages/Login';
import Perfil from '../pages/Perfil';
import GaleriaObras from "../pages/GaleriaObras";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registrar" element={<RegistrarObra />} />
        <Route path="/RegistrarUsuario" element={<RegistrarUsuario />} />
        <Route path="/admin" element={<AdminObras />} />
        <Route path="/galeria" element={<GaleriaObras />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
};
