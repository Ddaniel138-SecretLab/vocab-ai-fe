import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import LearningSettingsView from "@/views/Learning/LearningSettingsView";
export default function Page() {
  return (
    <>
      <Head>
        <title>Cài đặt học tập | Vocab AI</title>
      </Head>
      <MainLayout>
        <LearningSettingsView />
      </MainLayout>
    </>
  );
}
