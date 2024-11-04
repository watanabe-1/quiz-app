import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | 管理者用 | 過去問テスト",
    default: "管理者用",
  },
};

const AdminLayout = async (props: { children: React.ReactNode }) => {
  const children = await props.children;

  return <div>{children}</div>;
};

export default AdminLayout;
