import { z } from "zod";

export const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .pipe(z.email("Invalid email")),
  phoneNumber: z.string().optional(),
  // dateOfBirth: z.string().optional(),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;
