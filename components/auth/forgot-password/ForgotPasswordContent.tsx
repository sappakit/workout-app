import { authApi } from "@/app/api/auth.api";
import { PageLayout } from "@/components/layout/PageLayout";
import { api } from "@/lib/api";
import { useAppToast } from "@/lib/toast/useAppToast";
import {
  ForgotPasswordForm as ForgotPasswordFormValues,
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
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
    onSuccess: () => {
      setIsEmailSent(true);
    },
    onError: () => {
      toast.error({
        title: "Email failed",
        message: "Unable to send reset link. Please try again.",
      });
    },
  });

  return (
    <PageLayout>
      {isEmailSent ? (
        <ForgotPasswordSuccess />
      ) : (
        <ForgotPasswordForm
          control={control}
          errors={errors}
          loading={isPending}
          onSubmit={handleSubmit((values) => mutate(values))}
        />
      )}
    </PageLayout>
  );
}
