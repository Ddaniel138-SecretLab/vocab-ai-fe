import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import ProfileView from "@/views/Profile/ProfileView";
export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Hồ sơ | Vocab AI</title>
      </Head>
      <MainLayout>
        <ProfileView />
      </MainLayout>
    </>
  );
}
