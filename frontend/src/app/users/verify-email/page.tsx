import {
  verifyEmailToken,
  type VerifyEmailResult,
} from "@/actions/emailVerification";
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

  if (!token) {
    const result: VerifyEmailResult = {
      status: "pending",
      message:
        "We've sent a verification link to your email. Please check your inbox (including spam) and click the link to verify your account.",
    };
    return <VerifyEmailContent result={result} defaultEmail={email} />;
  }

  const result = await verifyEmailToken(token, callbackURL);
  return <VerifyEmailContent result={result} defaultEmail={email} />;
}
