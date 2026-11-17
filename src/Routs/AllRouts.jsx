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
import Payment from "../Navigation/Payment";
import PaymentHistory from "../Navigation/PaymentHistory";
import RidersList from "../Navigation/RidersList";
import UsersList from "../Navigation/UsersList";
import AllParcels from "../Navigation/AllParcels";
import AdminRoute from "../AuthPage/AdminRoute";
import NotFound from "../Shared/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'coverage',
        element: <Coverage />,
        loader: () => fetch('/warehouses.json').then(res => res.json()),
      },
      {
        path: 'aboutus',
        element: <AboutUs />
      },
      {
        path: 'pricing',
        element: <PrivateRoute><Pricing /></PrivateRoute>,
        loader: () => fetch('/warehouses.json').then(res => res.json()),
      },
      {
        path: 'bearider',
        element: <PrivateRoute><BeARider /></PrivateRoute>,
        loader: () => fetch('/warehouses.json').then(res => res.json()),
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
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
      },
      {
        path: 'payment',
        element: <Payment />
      },
      {
        path: 'payment-history',
        element: <PaymentHistory />
      },
      {
        path: 'riders-list',
        element: <AdminRoute><RidersList /></AdminRoute>
      },
      {
        path: 'users-list',
        element: <AdminRoute><UsersList /></AdminRoute>
      },
      {
        path: 'all-parcels',
        element: <AdminRoute><AllParcels /></AdminRoute>
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);