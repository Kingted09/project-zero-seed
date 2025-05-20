
import { Outlet } from 'react-router-dom';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
