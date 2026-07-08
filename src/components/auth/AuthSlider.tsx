"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

type AuthMode = "login" | "register";

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

function readMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
  }
  return fallback;
}

export function AuthSlider({ initialMode = "login" }: AuthSliderProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "Anshul_testing@gmail.com",
    password: "klB$ameK*fr=@uTR98wl",
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    phone_no: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState<AuthMode | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const isRegister = mode === "register";

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading("login");
    setMessage(null);

    try {
      const response = await fetch("/api/app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(readMessage(data, "Unable to login. Please check your details."));
      }

      const payload = data && typeof data === "object" ? (data as Record<string, any>) : {};
      const token = payload.token || payload.access_token || payload.data?.token || null;
      const userData = payload.data || payload;
      const userName = userData?.name || "";
      const userEmail = userData?.email || "";

      if (typeof token === "string") {
        localStorage.setItem("ain_auth_token", token);
      }
      if (typeof userName === "string" && userName) {
        localStorage.setItem("ain_user_name", userName);
      }
      if (typeof userEmail === "string" && userEmail) {
        localStorage.setItem("ain_user_email", userEmail);
      }
      if (userData && typeof userData === "object") {
        localStorage.setItem("ain_user_data", JSON.stringify(userData));
      }

      setMessage({ type: "success", text: readMessage(data, "Login successful.") });
      setTimeout(() => {
        router.push(redirectPath);
      }, 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to login. Please try again.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading("register");
    setMessage(null);

    if (registerForm.password !== registerForm.confirm_password) {
      setMessage({ type: "error", text: "Password and confirm password must match." });
      setLoading(null);
      return;
    }

    try {
      const response = await fetch("/api/app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(readMessage(data, "Unable to create account. Please try again."));
      }

      setMessage({ type: "success", text: readMessage(data, "Account created successfully. Please login.") });
      setRegisterForm({
        name: "",
        phone_no: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setMode("login");
      setTimeout(() => {
        router.push(redirectPath);
      }, 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to create account. Please try again.",
      });
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 4200);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#f8f9fc] px-4 py-10 font-sans text-[#191c1e] sm:py-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(255,112,18,0.11),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(105,53,219,0.14),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8f9fc_55%,#f3edff_100%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-[1000px] justify-center">
        {message && (
          <div
            className={`absolute left-1/2 top-6 z-50 w-full max-w-[420px] -translate-x-1/2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl transition-all duration-300 ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <div className={`auth-panel-container shadow-[0_8px_32px_rgba(25,28,30,0.06)] ${isRegister ? "right-panel-active" : ""}`}>
          <div className="auth-form-container auth-login-container flex flex-col justify-center bg-white p-6 sm:p-8 lg:p-12">
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
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className={labelClass} htmlFor="login-password">
                    Password
                  </label>
                  <Link className="text-sm font-semibold text-[#6935db] transition-colors duration-200 hover:text-[#530ec6]" href="#">
                    Forgot password?
                  </Link>
                </div>
                <div className="group relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                  <input
                    className={passwordInputClass}
                    id="login-password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showLoginPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  />
                  <button
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594136] transition-colors duration-200 hover:text-[#191c1e]"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    type="button"
                  >
                    {showLoginPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff7012] py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ff7012]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
                  className="ml-1 font-semibold text-[#a04100] transition-colors duration-200 hover:text-[#ff7012]"
                  onClick={() => {
                    setMode("register");
                    setMessage(null);
                  }}
                  type="button"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>

          <div className="auth-form-container auth-signup-container flex flex-col justify-center bg-white p-6 sm:p-8 lg:p-12">
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
                    placeholder="Rahul Sharma"
                    required
                    type="text"
                    value={registerForm.name}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="signup-phone">
                  Phone Number
                </label>
                <div className="group relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#594136] transition-colors duration-200 group-focus-within:text-[#6935db]" />
                  <input
                    className={inputClass}
                    id="signup-phone"
                    name="phone_no"
                    placeholder="9876543210"
                    required
                    type="tel"
                    value={registerForm.phone_no}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, phone_no: event.target.value }))}
                  />
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
                    placeholder="rahuldev5277@gmail.com"
                    required
                    type="email"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
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
                      placeholder="••••••"
                      required
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerForm.password}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                    />
                    <button
                      aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594136] transition-colors duration-200 hover:text-[#191c1e]"
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
                      placeholder="••••••"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerForm.confirm_password}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, confirm_password: event.target.value }))}
                    />
                    <button
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594136] transition-colors duration-200 hover:text-[#191c1e]"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      type="button"
                    >
                      {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff7012] py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ff7012]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
                  className="ml-1 font-semibold text-[#a04100] transition-colors duration-200 hover:text-[#ff7012]"
                  onClick={() => {
                    setMode("login");
                    setMessage(null);
                  }}
                  type="button"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>

          <div className="auth-content-panel hidden flex-col items-center justify-start overflow-hidden bg-[linear-gradient(135deg,#6935db_0%,#530ec6_100%)] text-center text-white md:flex">
              <div className="relative h-[300px] w-full overflow-hidden rounded-sm bg-[#7c3aed]/30 lg:h-[330px]">
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

      {message && (
        <div
          className={`fixed right-6 top-6 z-50 w-full max-w-[380px] rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl transition-all duration-300 ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <style jsx>{`
        .auth-panel-container {
          position: relative;
          display: flex;
          min-height: 640px;
          width: 100%;
          max-width: 1000px;
          overflow: hidden;
          border-radius: 1rem;
          background: #ffffff;
        }

        .auth-form-container {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          transition: all 0.6s ease-in-out;
          z-index: 1;
        }

        .auth-login-container {
          left: 0;
          opacity: 1;
          z-index: 2;
        }

        .auth-signup-container {
          left: 0;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }

        .auth-content-panel {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 10;
          height: 100%;
          width: 50%;
          transition: transform 0.6s ease-in-out;
        }

        .auth-panel-container.right-panel-active .auth-login-container {
          transform: translateX(100%);
          opacity: 0;
          pointer-events: none;
        }

        .auth-panel-container.right-panel-active .auth-signup-container {
          transform: translateX(100%);
          opacity: 1;
          pointer-events: auto;
          z-index: 5;
        }

        .auth-panel-container.right-panel-active .auth-content-panel {
          transform: translateX(-100%);
        }

        @media (max-width: 767px) {
          .auth-panel-container {
            display: block;
            min-height: auto;
            overflow: visible;
            border-radius: 0.875rem;
          }

          .auth-form-container {
            position: relative;
            width: 100%;
            height: auto;
            transition: opacity 0.25s ease;
          }

          .auth-login-container,
          .auth-signup-container,
          .auth-panel-container.right-panel-active .auth-login-container,
          .auth-panel-container.right-panel-active .auth-signup-container {
            transform: none;
          }

          .auth-login-container {
            display: ${isRegister ? "none" : "flex"};
            opacity: ${isRegister ? "0" : "1"};
          }

          .auth-signup-container {
            display: ${isRegister ? "flex" : "none"};
            opacity: ${isRegister ? "1" : "0"};
            pointer-events: auto;
          }
        }
      `}</style>
    </section>
  );
}
