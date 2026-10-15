import { Metadata } from "next";
import { AuthSlider } from "@/components/auth/AuthSlider";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <AuthSlider initialMode="login" />;
}
