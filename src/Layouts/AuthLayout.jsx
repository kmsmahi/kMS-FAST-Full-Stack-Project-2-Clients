import React from 'react';
import Logo from '../HomePage/Logo';
import { Outlet } from 'react-router';
import { NavLink } from 'react-router';
import AuthImg from '../AuthPage/AuthImg';
const AuthLayout = () => {
    return (
        <div className='flex gap-6 justify-between'>
            {/* section 1 */}
            <section>
                <div className='mt-6'>
                <NavLink
            to="/aboutus"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#CAEB66] rounded-lg p-1"
            aria-label="KMS-FAST Home"
          >
            <div className="w-16 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Logo />
            </div>
            <span className="text-4xl font-bold tracking-tight text-gray-900 font-sans -ms-4 pt-3">
              KMS<span className="text-[#96b830] font-extrabold">-FAST</span>
            </span>
          </NavLink>
            </div>
            <Outlet></Outlet>
            </section>

            {/* section 2 */}
            <section  className='bg-gray-100 max-h-screen'>
                <AuthImg></AuthImg>
            </section>
           
        </div>
    );
};

export default AuthLayout;