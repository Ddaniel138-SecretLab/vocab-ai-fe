import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import TopicsView from "@/views/Topics/TopicsView";
export default function VocabularyPage() {
  return (
    <>
      <Head>
        <title>Chủ đề từ vựng | Vocab AI</title>
      </Head>
      <MainLayout>
        <TopicsView />
      </MainLayout>
    </>
  );
}
