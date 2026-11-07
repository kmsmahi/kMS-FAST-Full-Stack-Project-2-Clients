import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../HomePage/Home";
import Coverage from "../Navigation/Coverage";
import AboutUs from "../Navigation/AboutUs";
import Pricing from "../Navigation/Pricing";
import BeARider from "../Navigation/BeARider";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../AuthPage/Login";
import Register from "../AuthPage/Register";
import PrivateRoute from "../AuthPage/PrivateRoute";
import SendParcel from "../Navigation/SendParcel";
import MyParcels from "../Navigation/MyParcels";
import DashboardLayout from "../Layouts/DashBoardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children:[
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: 'coverage',
        element: <Coverage></Coverage>,
        loader: () => fetch('/warehouses.json').then(res => res.json()),
      },
      {
        path: 'aboutus',
        element: <AboutUs></AboutUs>
      },
      {
        path: 'pricing',
        element: <PrivateRoute><Pricing /></PrivateRoute>
      },
      {
        path: 'bearider',
        element: <PrivateRoute><BeARider /></PrivateRoute>
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout></AuthLayout>,
    children:[
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'register',
        element: <Register></Register>
      },
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { 
        path: '', 
        element: <div className="text-xl font-bold">Welcome to your Dashboard Overview!</div> 
      },
      { 
        path: 'my-parcels', 
        element: <MyParcels /> 
      },
      { 
        path: 'send-parcel', 
        element: <SendParcel />,
        loader: () => fetch('/warehouses.json').then(res => res.json()),
      }
    ]
  }
]);