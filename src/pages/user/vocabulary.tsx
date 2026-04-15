import React from 'react';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Vocabulary from '@/views/Vocabulary/Vocabulary';


export default function VocabularyPage() {
  return (
    <>
      <MainLayout>
        <Vocabulary />
      </MainLayout>
    </>
  );
}