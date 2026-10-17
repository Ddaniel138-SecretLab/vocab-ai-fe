import Head from "next/head";
import AdminLoginView from "@/views/Admin/AdminLoginView";
export default function Page() {
  return (
    <>
      <Head>
        <title>Đăng nhập quản trị | Vocab AI</title>
      </Head>
      <AdminLoginView />
    </>
  );
}
