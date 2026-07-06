import { z } from "zod";

// Sign in
export const signInSchema = z.object({
  identifier: z
    .string()
    .nonempty("Email or username is required")
    .refine(
      (value) => {
        // Email case
        if (value.includes("@")) {
          return z.email().safeParse(value).success;
        }

        // Username case
        return value.trim().length >= 3;
      },
      {
        message: "Invalid email or username is too short",
      },
    ),
  password: z.string().nonempty("Password is required"),
});

export type SignInForm = z.infer<typeof signInSchema>;

// Sign up
export const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .pipe(z.email("Invalid email")),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpForm = z.infer<typeof signUpSchema>;

// Forgot password
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .pipe(z.email("Invalid email")),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

// Reset password
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

// Change password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
