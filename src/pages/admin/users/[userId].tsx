import { useRouter } from "next/router";
import AdminLayout from "@/layouts/AdminLayout";
import UserDetailView from "@/views/Admin/UserDetailView";
export default function Page() {
  const router = useRouter();
  return (
    <AdminLayout>
      {typeof router.query.userId === "string" && (
        <UserDetailView key={router.query.userId} id={router.query.userId} />
      )}
    </AdminLayout>
  );
}
