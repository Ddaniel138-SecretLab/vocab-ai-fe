import Head from "next/head";
import ForgotPasswordView from "@/views/Auth/ForgotPasswordView";
export default function Page() {
  return (
    <>
      <Head>
        <title>Quên mật khẩu | Vocab AI</title>
      </Head>
      <ForgotPasswordView />
    </>
  );
}
