import { auth } from "@/lib/auth/server";

// Бүх auth хүсэлтийг Neon Auth руу дамжуулна
export const { GET, POST, PUT, DELETE, PATCH } = auth.handler();
