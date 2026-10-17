import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import ReviewsView from "@/views/Learning/ReviewsView";
export default function Page() {
  return (
    <>
      <Head>
        <title>Ôn tập và Streak | Vocab AI</title>
      </Head>
      <MainLayout>
        <ReviewsView />
      </MainLayout>
    </>
  );
}
