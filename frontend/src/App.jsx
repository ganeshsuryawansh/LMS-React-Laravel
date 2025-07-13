import Courses from "./components/pages/Courses";
import Detail from "./components/pages/Detail";
import Home from "./components/pages/Home"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import MyCourses from "./components/pages/account/MyCourses";
import CoursesEnrolled from "./components/pages/CoursesEnrolled";
import WatchCourse from "./components/pages/account/WatchCourse";
import ChangePassword from "./components/pages/account/ChangePassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/account/login" element={<Login />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/account/my-courses" element={<MyCourses />} />
          <Route path="/account/Change-Password" element={<ChangePassword />} />
          <Route path="/account/courses-enrolled" element={<CoursesEnrolled />} />
          <Route path="/account/WatchCourse" element={<WatchCourse />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
