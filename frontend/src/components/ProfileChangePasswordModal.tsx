"use client";

import { useActionState, useEffect } from "react";
import styles from "./ProfileChangePasswordModal.module.css";
import {
  ChangePasswordState,
  changePassword,
} from "@/actions/password";

type ProfileChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialState: ChangePasswordState = {
  status: "idle",
};

export default function ProfileChangePasswordModal({
  open,
  onClose,
}: ProfileChangePasswordModalProps) {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    if (state.status === "success") {
      const timeout = setTimeout(onClose, 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.status, open, onClose]);

  if (!open) {
    return null;
  }

  const disableInputs = isPending || state.status === "success";

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <h3 className={styles.title}>Change password</h3>
        <p className={styles.helper}>
          Update your password to keep your Furrever account secure.
        </p>

        {state.message && state.status !== "error" && (
          <div className={styles.success}>{state.message}</div>
        )}
        {state.status === "error" && state.message && (
          <p className={styles.error}>{state.message}</p>
        )}

        <form action={formAction}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="currentPassword">
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              className={styles.input}
              placeholder="Enter current password"
              required
              disabled={disableInputs}
            />
            {state.fieldErrors?.currentPassword && (
              <p className={styles.error}>{state.fieldErrors.currentPassword}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="newPassword">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className={styles.input}
              placeholder="New password"
              minLength={8}
              required
              disabled={disableInputs}
            />
            {state.fieldErrors?.newPassword && (
              <p className={styles.error}>{state.fieldErrors.newPassword}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={styles.input}
              placeholder="Repeat new password"
              minLength={8}
              required
              disabled={disableInputs}
            />
            {state.fieldErrors?.confirmPassword && (
              <p className={styles.error}>
                {state.fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primary}
              disabled={disableInputs}
            >
              {isPending ? "Updating..." : "Update password"}
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
