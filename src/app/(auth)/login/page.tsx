import { Metadata } from "next";
import { Suspense } from "react";
import { AuthSlider } from "@/components/auth/AuthSlider";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthSlider initialMode="login" />
    </Suspense>
  );
}
