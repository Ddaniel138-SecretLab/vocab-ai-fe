import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import StudySessionView from "@/views/Study/StudySessionView";
export default function Page() {
  const router = useRouter();
  const id = router.query.sessionId;
  return (
    <>
      <Head>
        <title>Phiên học tập | Vocab AI</title>
      </Head>
      <MainLayout>
        {router.isReady && typeof id === "string" && (
          <StudySessionView key={id} sessionId={id} />
        )}
      </MainLayout>
    </>
  );
}
