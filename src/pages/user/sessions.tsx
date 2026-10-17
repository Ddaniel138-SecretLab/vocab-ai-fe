import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import SessionHistoryView from "@/views/Study/SessionHistoryView";
export default function Page() {
  return (
    <>
      <Head>
        <title>Lịch sử học tập | Vocab AI</title>
      </Head>
      <MainLayout>
        <SessionHistoryView />
      </MainLayout>
    </>
  );
}
