"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function AdminToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const shownKey = useRef<string | null>(null);

  useEffect(() => {
    const type = searchParams.get("toast");
    const message = searchParams.get("message");

    if (!type || !message) {
      return;
    }

    const key = `${type}:${message}`;
    if (shownKey.current === key) {
      return;
    }
    shownKey.current = key;

    if (type === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("toast");
    next.delete("message");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}

export default function AdminToaster() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: "12px",
            background: "#0f766e",
            color: "#fff",
            fontWeight: 600,
          },
          success: {
            iconTheme: {
              primary: "#fff",
              secondary: "#0f766e",
            },
          },
          error: {
            style: {
              background: "#b42318",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#b42318",
            },
          },
        }}
      />
      <Suspense fallback={null}>
        <AdminToastListener />
      </Suspense>
    </>
  );
}
