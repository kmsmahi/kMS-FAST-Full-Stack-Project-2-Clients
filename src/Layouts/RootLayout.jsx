import { Outlet } from 'react-router';
import Footer from '../Shared/Footer';
import Navbar from '../Shared/Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen  flex flex-col">
      <Navbar></Navbar>
      <main className="pt-20 flex-grow"> 
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
}