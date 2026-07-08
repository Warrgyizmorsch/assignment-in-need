import { Suspense } from "react";
import { AuthSlider } from "@/components/auth/AuthSlider";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthSlider initialMode="login" />
    </Suspense>
  );
}
