import { Suspense } from "react";
import { AuthSlider } from "@/components/auth/AuthSlider";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <AuthSlider initialMode="register" />
    </Suspense>
  );
}
