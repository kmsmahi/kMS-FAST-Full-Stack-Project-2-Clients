import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../HomePage/Home";
import Coverage from "../Navigation/Coverage";
import AboutUs from "../Navigation/AboutUs";
import Pricing from "../Navigation/Pricing";
import BeARider from "../Navigation/BeARider";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../AuthPage/Login";
// import Logout from "../AuthPage/Logout";
import Register from "../AuthPage/Register";
import PrivateRoute from "../AuthPage/PrivateRoute";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children:[
      {
        index:true,
        element:<Home></Home>
      },
      {
        path:'/coverage',
        element:<Coverage></Coverage>,
        loader:()=>fetch('/warehouses.json')
        .then(res=>res.json()),
      },
      {
        path:'/aboutus',
        element:<AboutUs></AboutUs>
      },
      {
        path:'/pricing',
        element:<PrivateRoute>
          <Pricing></Pricing>
        </PrivateRoute>
      },
      {
        path:'/bearider',
        element:<PrivateRoute>
          <BeARider></BeARider>
        </PrivateRoute>
      },
    ]
  },

  {
    path:'/',
    element:<AuthLayout></AuthLayout>,
    children:[
      {
        path:'/login',
        element:<Login></Login>
      },
      // {
      //   path:'/logout',
      //   element:<Logout></Logout>
      // },
      {
        path:'/register',
        element:<Register></Register>
      },
    ]
  }
]);