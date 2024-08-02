import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Teacher from './pages/Teacher.jsx';
import StudentDashboard from './pages/StudentDashboard'
import Error from './pages/Error.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from './pages/Logout.jsx';
import './index.css';
import UserProvider from './context/userContext.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider><Layout /></UserProvider>,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "student", element: <StudentDashboard />},
      { path: "teacher", element: <Teacher /> },
      {path: "logout",element:<Logout/> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  </React.StrictMode>
);
