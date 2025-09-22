import DevControls from '@/components/dev/DevControls';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="relative h-screen min-w-full text-black dark:text-white">
      <div
        id="background"
        className="-z-1 absolute h-full min-w-full bg-[url('/images/background.webp')] bg-cover blur-sm"
      ></div>
      <DevControls />
      <Outlet />
    </div>
  );
};

export default Layout;
