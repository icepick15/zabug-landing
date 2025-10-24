import React from 'react';

type DashboardLayoutProps = React.PropsWithChildren;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return <>{children}</>;
};

export default DashboardLayout;