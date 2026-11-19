"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Төлбөр хүлээгдэж байх үед хуудсыг 4 секунд тутам (хамгийн ихдээ ~3 минут) шинэчилнэ. */
export function AutoRefresh({ intervalMs = 4000, maxTries = 45 }: { intervalMs?: number; maxTries?: number }) {
  const router = useRouter();
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      if (++tries >= maxTries) clearInterval(id);
      router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs, maxTries]);
  return null;
}
