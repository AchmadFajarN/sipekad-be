import { z } from "zod";

// auth
export const loginSchema = z.object({
  email: z.string().email({ message: "email tidak valid" }),
  password: z.string().min(6, { message: "password minimal harus 6 digit" }),
});

// user
export const updateUserSchema = z.object({
  username: z.string().min(1, { message: "username minimal harus 1 digit" }),
  nim: z.string().min(9, "nim minimal harus 9 digit").max(15, "nim maksimal harus 15 digit"),
  full_name: z
    .string()
    .min(3, "nama lengkap minimal harus 3 digit")
    .max(100, "nama lengkap maksimal 100 digit"),
  email: z.string().email({ message: "email tidak valid" }),
  phone: z
    .string()
    .min(10, "no telephone minimal 10 digit")
    .max(15, "no telephone maksimal 15 digit"),
});

export const addUserSchema = z.object({
  username: z.string().min(1, { message: "username minimal harus 1 digit" }),
  password: z.string().min(1, "password minmal harus lebih dari 1 digit"),
  role: z.enum(["user", "admin"]),
  nim: z.string().min(1, "nim harus minimal 1 digit").max(20, "nim maksimal 20 digit"),
  full_name: z.string().min(3, "nama lengkap minimal haris 3 digit").max(100, "nama lengkap maksimal 100 digit"),
  email: z.string().email({message: "email tidak valid"}),
  phone: z.string().min(10, "no telephone minimal 10 digit").max(15, "no telepon maksimal 15 digit")
});

// request
export const postRequestSchema = z.object({
  type: z.string().max(200, "message maksimal harus 50 digit "),
  message: z.string(),
});

// response
export const postResponseSchema = z.object({
  message: z.string().min(1, "pesan harus ada"),
  requestId: z.string().max(100, "Maksimal 100 digit"),
  isComplete: z.boolean().nullable(),
});

export const updateResponseSchema = z.object({
  message: z.string().min(1, "Pesan harus ada")
})
