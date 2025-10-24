import React from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';

type DashboardSectionLayoutProps = React.PropsWithChildren;

const DashboardSectionLayout = ({ children }: DashboardSectionLayoutProps) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default DashboardSectionLayout;
