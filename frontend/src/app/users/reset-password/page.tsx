import ResetPasswordForm from "./ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: {
    token?: string;
  };
};

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams.token ?? "";

  return <ResetPasswordForm token={token} />;
}
