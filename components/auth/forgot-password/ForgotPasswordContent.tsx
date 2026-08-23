import { PageLayout } from "@/components/layout/PageLayout";
import { authApi } from "@/lib/api/auth.api";
import { api } from "@/lib/api/client";
import { useAppToast } from "@/lib/toast/useAppToast";
import {
  type ForgotPasswordForm as ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordForm } from "./ui/ForgotPasswordForm";
import { ForgotPasswordSuccess } from "./ui/ForgotPasswordSuccess";

export default function ForgotPasswordContent() {
  const toast = useAppToast();

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ForgotPasswordFormValues) => {
      return api.post(authApi.forgotPassword(), values);
    },
    onSuccess: (_, values) => {
      setSubmittedEmail(values.email);
      setIsEmailSent(true);
    },
    onError: () => {
      toast.error({
        title: "Email failed",
        message: "Unable to send reset link. Please try again.",
      });
    },
  });

  const handleResendEmail = () => {
    if (!submittedEmail) return;

    mutate({
      email: submittedEmail,
    });
  };

  return (
    <PageLayout includeInsets={{ top: true }}>
      {isEmailSent ? (
        <ForgotPasswordSuccess
          email={submittedEmail}
          loading={isPending}
          onResend={handleResendEmail}
        />
      ) : (
        <ForgotPasswordForm
          control={control}
          loading={isPending}
          onSubmit={handleSubmit((values) => mutate(values))}
        />
      )}
    </PageLayout>
  );
}
