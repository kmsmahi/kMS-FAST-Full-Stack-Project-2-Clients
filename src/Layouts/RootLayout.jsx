import { Outlet } from 'react-router';
import Footer from '../Shared/Footer';
import Navbar from '../Shared/Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen  flex flex-col gap-6">
      <Navbar></Navbar>
      <main className="pt-20 mt-12"> 
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
}