import NotificationIcon
  from '@/app/dashboard/[account_id]/components/notification-icon';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ComponentType } from 'react';

export default function withDashboardHeader<P extends object>(
  WrappedComponent?: ComponentType<P>,
) {
  return function WithDashboardHeader(componentProps: P) {
    return (
      <header className="flex h-1/12 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <SidebarTrigger className="ml-1 mr-1" />
        {WrappedComponent && <WrappedComponent {...(componentProps as P)} />}
        <NotificationIcon count={20} />
      </header>
    );
  };
}
