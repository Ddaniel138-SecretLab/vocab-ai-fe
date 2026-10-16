import { useRouter } from "next/router";
import AdminLayout from "@/layouts/AdminLayout";
import UserForm from "@/views/Admin/UserForm";
import { PageTitle } from "@/components/learning/Common";
export default function Page() {
  const router = useRouter();
  return (
    <AdminLayout>
      <PageTitle title="Tạo tài khoản" />
      <UserForm
        onSaved={(user) => void router.replace(`/admin/users/${user.id}`)}
      />
    </AdminLayout>
  );
}
