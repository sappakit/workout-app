import { PageLayout } from "@/components/layout/PageLayout";
import { authApi } from "@/lib/api/auth.api";
import { api } from "@/lib/api/client";
import { useAppToast } from "@/lib/toast/useAppToast";
import {
  ResetPasswordForm as ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordForm } from "./ui/ResetPasswordForm";
import { ResetPasswordSuccess } from "./ui/ResetPasswordSuccess";

interface ResetPasswordContentProps {
  token: string;
}

export default function ResetPasswordContent({
  token,
}: ResetPasswordContentProps) {
  const toast = useAppToast();

  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      return api.post(authApi.resetPassword(), {
        token,
        password: values.password,
      });
    },
    onSuccess: () => {
      setIsPasswordReset(true);
    },
    onError: () => {
      toast.error({
        title: "Reset failed",
        message: "This reset link may be invalid or expired.",
      });
    },
  });

  return (
    <PageLayout includeInsets={{ top: true }}>
      {isPasswordReset ? (
        <ResetPasswordSuccess />
      ) : (
        <ResetPasswordForm
          control={control}
          errors={errors}
          loading={isPending}
          disabled={false}
          onSubmit={handleSubmit((values) => mutate(values))}
        />
      )}
    </PageLayout>
  );
}
