import { Outlet } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split('/').pop() || 'profile';

  return (
    <div className="space-y-6">
      <Tabs 
        value={currentTab} 
        onValueChange={(value) => navigate(`/dashboard/settings/${value}`)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="platform" className="hidden sm:flex">
            Platform Settings
          </TabsTrigger>
        </TabsList>
        <Outlet />
      </Tabs>
    </div>
  );
}
