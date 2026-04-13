import React from 'react';
import MainLayout from '../layouts/MainLayout';
import DashboardView from '../views/Dashboard/DashboardView';

const DashboardPage: React.FC = () => {
    return (
        <MainLayout>
            <DashboardView />
        </MainLayout>
    );
};

export default DashboardPage;