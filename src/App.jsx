import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MyClasses from './pages/MyClasses';
import ClassDetail from './pages/ClassDetail';
import Schedule from './pages/Schedule';
import SubjectMaterials from './pages/SubjectMaterials';
import Announcements from './pages/Announcements';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<MyClasses />} />
        <Route path="/class/:id" element={<ClassDetail />} />
        <Route path="/class/:classId/subject/:subjectId" element={<SubjectMaterials />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/announcements" element={<Announcements />} />
      </Routes>
    </Router>
  );
}

export default App;