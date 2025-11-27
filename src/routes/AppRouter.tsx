import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import FileView from '../pages/FileView';
import Search from '../pages/Search';

function AppRouter() {
  return (
    <Routes>
      {/* Public routes without AppLayout */}
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes with AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/main" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/file/:fileId" element={<FileView />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
