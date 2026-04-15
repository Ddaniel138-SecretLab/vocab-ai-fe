import React from 'react';
import Head from 'next/head';
import DashboardView from '@/views/Dashboard/DashboardView';
import MainLayout from '@/layouts/MainLayout';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Tổng quan | Vocab AI</title>
      </Head>
      
      {/* Bao bọc toàn bộ nội dung bằng MainLayout */}
      <MainLayout>
        <DashboardView />
      </MainLayout>
    </>
  );
};

export default DashboardPage;