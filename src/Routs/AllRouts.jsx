import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../HomePage/Home";
import Coverage from "../Navigation/Coverage";
import AboutUs from "../Navigation/AboutUs";
import Pricing from "../Navigation/Pricing";
import BeARider from "../Navigation/BeARider";


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
        element:<Coverage></Coverage>
      },
      {
        path:'/aboutus',
        element:<AboutUs></AboutUs>
      },
      {
        path:'/pricing',
        element:<Pricing></Pricing>
      },
      {
        path:'/bearider',
        element:<BeARider></BeARider>
      },
    ]
  },
]);