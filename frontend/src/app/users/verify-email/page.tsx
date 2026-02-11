import { verifyEmailToken } from "@/actions/emailVerification";
import VerifyEmailContent from "./VerifyEmailContent";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
    callbackURL?: string;
    email?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = (await searchParams) ?? {};
  const { token, callbackURL, email } = params;
  const result = await verifyEmailToken(token, callbackURL);

  return <VerifyEmailContent result={result} defaultEmail={email} />;
}
