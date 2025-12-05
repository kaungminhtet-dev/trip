import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Metadata } from 'next';
import { Toaster } from 'sonner';
import NavPanel from './components/nav-panel';

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "Admin Dashboard",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <NavPanel />
      <SidebarInset className={"h-screen"}>
        {children}
        <Toaster position="bottom-right" richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}
