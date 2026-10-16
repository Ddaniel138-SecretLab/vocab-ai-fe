import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import TopicDetailView from "@/views/Topics/TopicDetailView";
export default function Page() {
  const router = useRouter();
  const id = router.query.topicId;
  return (
    <>
      <Head>
        <title>Từ vựng theo chủ đề | Vocab AI</title>
      </Head>
      <MainLayout>
        {router.isReady && typeof id === "string" && (
          <TopicDetailView key={id} topicId={id} />
        )}
      </MainLayout>
    </>
  );
}
