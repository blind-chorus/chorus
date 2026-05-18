import { Nav } from '../../components/Nav';
import { SideNav } from '../../components/SideNav';
import { MobileNavProvider } from '../../components/MobileNav';

export default function SiteLayout({ children }) {
  return (
    <MobileNavProvider>
      <Nav />
      <SideNav />
      <div className="app-main">
        {children}
      </div>
    </MobileNavProvider>
  );
}
