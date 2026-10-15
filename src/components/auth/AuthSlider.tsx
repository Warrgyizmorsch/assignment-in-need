"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { CustomDropdown } from "../ui/CustomDropdown";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import "./auth-slider.css";

import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

import {
  ArrowRight,
  Award,
  Eye,
  EyeOff,
  Headphones,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

const COUNTRY_CODES = (() => {
  try {
    return getCountries()
      .map((country) => {
        const code = getCountryCallingCode(country);
        const name = (en as any)?.[country] || country;
        return {
          label: `+${code} (${country === "GB" ? "UK" : name})`,
          value: `+${code}`,
          country,
        };
      })
      .sort((a, b) => {
        if (a.country === "GB") return -1;
        if (b.country === "GB") return 1;
        return a.label.localeCompare(b.label);
      });
  } catch {
    return [
      { label: "+44 (UK)", value: "+44", country: "GB" },
      { label: "+1 (US/CA)", value: "+1", country: "US" },
      { label: "+61 (Australia)", value: "+61", country: "AU" },
      { label: "+91 (India)", value: "+91", country: "IN" },
      { label: "+971 (UAE)", value: "+971", country: "AE" },
    ];
  }
})();

type AuthMode = "login" | "register" | "forgot";

interface AuthSliderProps {
  initialMode?: AuthMode;
}

interface RegisterForm {
  name: string;
  phone_no: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface LoginForm {
  email: string;
  password: string;
}

const inputClass =
  "w-full rounded-lg border border-[#e1c0b1] bg-white py-3 pl-10 pr-4 text-[15px] text-[#191c1e] placeholder:text-[#594136]/60 transition-all duration-300 focus:border-[#6935db] focus:outline-none focus:ring-2 focus:ring-[#6935db]/20";

const passwordInputClass =
  "w-full rounded-lg border border-[#e1c0b1] bg-white py-3 pl-10 pr-12 text-[15px] text-[#191c1e] placeholder:text-[#594136]/60 transition-all duration-300 focus:border-[#6935db] focus:outline-none focus:ring-2 focus:ring-[#6935db]/20";

const labelClass = "text-sm font-semibold text-[#191c1e]";

function readMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
  }
  return fallback;
}

export function AuthSlider({ initialMode = "login" }: AuthSliderProps) {
  const pathname = usePathname();

  const getModeFromPathname = (path: string, fallback: AuthMode): AuthMode => {
    if (path === "/signup") return "register";
    if (path === "/forgot-password") return "forgot";
    if (path === "/login") return "login";
    return fallback;
  };

  const [mode, setMode] = useState<AuthMode>(() =>
    getModeFromPathname(pathname, initialMode)
  );

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    phone_no: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [registerCountryCode, setRegisterCountryCode] = useState("+44");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState<AuthMode | null>(null);
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState("/profile");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      if (redirect) setRedirectPath(redirect);
    }
  }, []);

  useEffect(() => {
    setMode(getModeFromPathname(pathname, initialMode));
  }, [pathname, initialMode]);

  const switchMode = (newMode: AuthMode, targetPath: string) => {
    setMode(newMode);
    if (typeof window !== "undefined" && window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  };

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading("login");

    try {
      const response = await fetch("/api/app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          readMessage(data, "Unable to login. Please check your details.")
        );
      }

      const payload = data && typeof data === "object" ? (data as Record<string, any>) : {};
      const token = payload.token || payload.access_token || payload.data?.token || null;

      if (typeof token === "string") {
        localStorage.setItem("ain_auth_token", token);
      }

      const userData = payload.data || payload.user || payload;
      if (userData?.name) localStorage.setItem("ain_user_name", userData.name);
      if (userData?.email) localStorage.setItem("ain_user_email", userData.email || loginForm.email);
      if (userData && typeof userData === "object") {
        localStorage.setItem("ain_user_data", JSON.stringify(userData));
      }

      if (typeof token === "string") {
        try {
          const profileRes = await fetch("/api/app/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          const profileJson = await profileRes.json().catch(() => null);

          if (profileRes.ok && profileJson?.success && profileJson?.data) {
            const pd = profileJson.data as Record<string, any>;
            localStorage.setItem("ain_user_name", pd.name || "");
            localStorage.setItem("ain_user_email", pd.email || "");
            localStorage.setItem("ain_user_data", JSON.stringify(pd));
          }
        } catch {
          // ignore
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ain-auth-change"));
      }

      toast.success(readMessage(data, "Login successful."));
      router.push(redirectPath);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to login. Please try again."
      );
    } finally {
      setLoading(null);
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading("register");

    if (registerForm.password !== registerForm.confirm_password) {
      toast.error("Password and confirm password must match.");
      setLoading(null);
      return;
    }

    try {
      const payload = {
        ...registerForm,
        phone_no: `${registerCountryCode} ${registerForm.phone_no.trim()}`,
      };

      const response = await fetch("/api/app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          readMessage(data, "Unable to create account. Please try again.")
        );
      }

      toast.success(readMessage(data, "Account created successfully. Please login."));
      setRegisterForm({
        name: "",
        phone_no: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      switchMode("login", "/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create account. Please try again."
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#f8f9fc] px-4 py-10 font-sans text-[#191c1e] sm:py-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(255,112,18,0.11),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(105,53,219,0.14),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8f9fc_55%,#f3edff_100%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-[1000px] justify-center">
        <div className="auth-panel-container">
          {/* LOGIN CONTAINER */}
          {mode === "login" && (
            <div className="auth-form-container">
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffdbcb]/40">
                  <Award className="h-8 w-8 text-[#a04100]" />
                </div>
                <h1 className="mb-2 text-[28px] font-extrabold leading-tight text-[#a04100]">
                  Assignment In Need
                </h1>
                <p className="text-[15px] leading-relaxed text-[#594136]">
                  Welcome back. Please enter your details.
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                <div className="flex flex-col gap-2">
                  <label className={labelClass} htmlFor="login-email">
                    Email
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                    <input
                      className={inputClass}
                      id="login-email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      type="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass} htmlFor="login-password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode("forgot", "/forgot-password")}
                      className="border-none bg-transparent p-0 text-sm font-semibold text-[#6935db] transition-colors duration-200 hover:text-[#530ec6] cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                    <input
                      className={passwordInputClass}
                      id="login-password"
                      name="password"
                      placeholder="Password"
                      required
                      type={showLoginPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                    />
                    <button
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594136] transition-colors duration-200 hover:text-[#191c1e] cursor-pointer"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      type="button"
                    >
                      {showLoginPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  className="btn-shutter-orange-open mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 border-none cursor-pointer"
                  disabled={loading === "login"}
                  type="submit"
                >
                  {loading === "login" ? "Logging in..." : "Login"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-8 border-t border-[#e1e2e5] pt-4 text-center">
                <p className="text-[15px] text-[#594136]">
                  Don&apos;t have an account?
                  <button
                    type="button"
                    onClick={() => switchMode("register", "/signup")}
                    className="ml-1 font-semibold text-[#a04100] transition-colors duration-200 hover:text-[#ff7012] border-none bg-transparent cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* REGISTER CONTAINER */}
          {mode === "register" && (
            <div className="auth-form-container">
              <div className="mb-6 flex flex-col items-center text-center">
                <h2 className="mb-2 text-[28px] font-extrabold leading-tight text-[#a04100]">
                  Create Account
                </h2>
                <p className="text-[15px] leading-relaxed text-[#594136]">
                  Join Assignment In Need today.
                </p>
              </div>

              <form className="flex flex-col gap-3" onSubmit={handleRegisterSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="signup-name">
                    Full Name
                  </label>
                  <div className="group relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                    <input
                      className={inputClass}
                      id="signup-name"
                      name="name"
                      placeholder="Enter your name"
                      required
                      type="text"
                      value={registerForm.name}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="signup-phone">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-[110px] shrink-0 border border-[#e1c0b1] bg-white rounded-lg pl-8 pr-1 flex items-center h-[48px]">
                      <Phone className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#594136]" />
                      <CustomDropdown
                        options={COUNTRY_CODES}
                        value={registerCountryCode}
                        onChange={setRegisterCountryCode}
                        align="left"
                      />
                    </div>
                    <div className="group relative flex-1">
                      <input
                        className={inputClass}
                        id="signup-phone"
                        name="phone_no"
                        placeholder="Enter phone number"
                        required
                        type="tel"
                        value={registerForm.phone_no}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({ ...prev, phone_no: event.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="signup-email">
                    Email
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                    <input
                      className={inputClass}
                      id="signup-email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      type="email"
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass} htmlFor="signup-password">
                      Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                      <input
                        className={passwordInputClass}
                        id="signup-password"
                        name="password"
                        placeholder="Create password"
                        required
                        type={showRegisterPassword ? "text" : "password"}
                        value={registerForm.password}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                        }
                      />
                      <button
                        aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594136] transition-colors duration-200 hover:text-[#191c1e] cursor-pointer"
                        onClick={() => setShowRegisterPassword((prev) => !prev)}
                        type="button"
                      >
                        {showRegisterPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass} htmlFor="signup-confirm-password">
                      Confirm Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                      <input
                        className={passwordInputClass}
                        id="signup-confirm-password"
                        name="confirm_password"
                        placeholder="Confirm password"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerForm.confirm_password}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({ ...prev, confirm_password: event.target.value }))
                        }
                      />
                      <button
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594136] transition-colors duration-200 hover:text-[#191c1e] cursor-pointer"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        type="button"
                      >
                        {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-shutter-orange-open mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 border-none cursor-pointer"
                  disabled={loading === "register"}
                  type="submit"
                >
                  {loading === "register" ? "Creating account..." : "Sign Up"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-6 border-t border-[#e1e2e5] pt-4 text-center">
                <p className="text-[15px] text-[#594136]">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => switchMode("login", "/login")}
                    className="ml-1 font-semibold text-[#a04100] transition-colors duration-200 hover:text-[#ff7012] border-none bg-transparent cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD CONTAINER */}
          {mode === "forgot" && (
            <div className="auth-form-container">
              <ForgotPasswordForm onSwitchMode={switchMode} />
            </div>
          )}

          {/* SIDE PANEL */}
          <div className="auth-content-panel">
            <div className="relative h-[300px] w-full overflow-hidden bg-[#7c3aed]/30 lg:h-[330px]">
              <Image
                src="/auth/academic-excellence.png"
                alt="Student using academic assignment help with laptop, books, and success icons"
                fill
                sizes="500px"
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-8 pb-8 pt-6">
              <h2 className="mb-3 text-[30px] font-extrabold leading-tight text-white">
                Academic Excellence
              </h2>
              <p className="mb-6 max-w-xs text-[17px] leading-relaxed text-[#cfbcff]">
                Your trusted partner for academic success.
              </p>
              <ul className="space-y-3 text-left">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#ffb693]" />
                  <span className="text-[15px] text-white">Expert writers across disciplines</span>
                </li>
                <li className="flex items-center gap-3">
                  <Headphones className="h-5 w-5 text-[#ffb693]" />
                  <span className="text-[15px] text-white">24/7 dedicated support</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#ffb693]" />
                  <span className="text-[15px] text-white">100% original, plagiarism-free work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
