"use client";

import { useActionState } from "react";
import styles from "./VerifyEmailReminder.module.css";
import {
  VerificationFormState,
  resendVerificationEmail,
} from "@/actions/emailVerification";

type VerifyEmailReminderProps = {
  email: string;
};

const initialState: VerificationFormState = {
  status: "idle",
};

export default function VerifyEmailReminder({ email }: VerifyEmailReminderProps) {
  const [state, resendAction, isPending] = useActionState(
    resendVerificationEmail,
    initialState,
  );

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.title}>Verify your email</span>
        <span>
          We sent a verification link to <strong>{email}</strong>. You need to
          confirm your email to access all features.
        </span>
        {state.message && (
          <span
            className={state.status === "success" ? styles.success : styles.error}
          >
            {state.message}
          </span>
        )}
      </div>
      <form action={resendAction} className={styles.actions}>
        <input type="hidden" name="email" value={email} />
        <button type="submit" className={styles.resend} disabled={isPending}>
          {isPending ? "Sending..." : "Resend link"}
        </button>
      </form>
    </div>
  );
}
