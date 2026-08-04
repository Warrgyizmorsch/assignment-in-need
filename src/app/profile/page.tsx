"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Settings,
  Shield,
  Gift,
  Award,
  Clock,
  CheckCircle,
  Plus,
  LogOut,
  ChevronRight,
  Download,
  AlertCircle,
  RefreshCw,
  XCircle,
  Hourglass,
  ReceiptText,
} from "lucide-react";
import toast from "react-hot-toast";

type ActiveTab = "overview" | "orders" | "edit-profile" | "rewards" | "security";
type OrderSubTab = "confirmed" | "pending";

/* ── API Types ─────────────────────────────────────────────────────────────── */
interface ConfirmedOrder {
  type: "confirmed";
  confirmed_status: string;
  order_db_id: number;
  lead_id: number;
  order_id: string;
  order_date: string | null;
  delivery_date: string | null;
  title: string | null;
  module_code: string | null;
  subject: string | null;
  status: string | null;
  word_count: string | null;
  amount: string | null;
  received_amount: string;
  due_amount: number;
  created_at: string;
  images: string[];
  files: string[];
}

interface NonConfirmedLead {
  type: "non_confirmed";
  confirmed_status: string;
  lead_id: number;
  order_id: string;
  name: string;
  email: string;
  mobile: string;
  service: string;
  work_type: string;
  word_count: string;
  price: string;
  deadline: string;
  delivery_time: string | null;
  requirements: string;
  created_at: string;
  subject: string;
  images: string[];
  files: string[];
}

interface OrderSummary {
  confirmed_count: number;
  non_confirmed_count: number;
}

interface OrderListData {
  confirmed_orders: ConfirmedOrder[];
  non_confirmed_leads: NonConfirmedLead[];
  summary: OrderSummary;
}

// These hit Next.js proxy routes (src/app/api/app/*/route.ts)
// which forward the request server-side — no CORS issues.
const PROFILE_API = "/api/app/profile";
const ORDER_LIST_API = "/api/app/order-list";


/* ── Status badge helper ────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
        <Clock className="h-3.5 w-3.5" /> Processing
      </span>
    );
  }
  const s = status.toLowerCase();
  if (s === "completed" || s === "delivered") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
        <CheckCircle className="h-3.5 w-3.5" /> {status}
      </span>
    );
  }
  if (s === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
        <XCircle className="h-3.5 w-3.5" /> Cancelled
      </span>
    );
  }
  if (s === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
        <Hourglass className="h-3.5 w-3.5" /> Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
      <Clock className="h-3.5 w-3.5" /> {status}
    </span>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [orderSubTab, setOrderSubTab] = useState<OrderSubTab>("confirmed");
  const [isClient, setIsClient] = useState(false);

  const [profile, setProfile] = useState({
    name: "Student",
    email: "student@example.com",
    phone_no: "+44 7300 000000",
    location: "United Kingdom",
    created_at: "2026-03-10",
  });
  const [editForm, setEditForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Order state
  const [orderData, setOrderData] = useState<OrderListData | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  /* ── Fetch orders (also used by the Refresh button) ── */
  const fetchOrders = useCallback(async (token: string) => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch(ORDER_LIST_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        setOrderData(json.data as OrderListData);
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load orders";
      setOrdersError(msg);
    } finally {
      setOrdersLoading(false);
    }
  }, []); // stable — no external deps

  /* ── Single init callback: loads profile + orders in parallel ── */
  const loadPageData = useCallback(
    async (token: string) => {
      // 1. Fetch profile from API (overwrites localStorage with fresh server data)
      try {
        const res = await fetch(PROFILE_API, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (res.ok) {
          const json = await res.json().catch(() => null);
          if (json?.success && json?.data) {
            const pd = json.data as Record<string, string>;
            const merged = {
              name: pd.name || "",
              email: pd.email || "",
              phone_no: pd.mobile_no || pd.phone_no || pd.phone || "+44 7300 000000",
              location: pd.country || pd.location || "United Kingdom",
              created_at: pd.created_at || new Date().toISOString(),
            };
            setProfile(merged);
            setEditForm(merged);
            localStorage.setItem("ain_user_name", merged.name);
            localStorage.setItem("ain_user_email", merged.email);
            localStorage.setItem("ain_user_data", JSON.stringify(pd));
          }
        }
      } catch {
        // silent — localStorage fallback already shown
      }

      // 2. Fetch orders in parallel
      fetchOrders(token);
    },
    [fetchOrders] // stable because fetchOrders is stable
  );

  /* ── Auth + page init ── */
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("ain_auth_token");
    if (!token) {
      toast.error("Please login to access your profile.");
      router.push("/login?redirect=/profile");
      return;
    }

    // Show cached profile data immediately while API loads
    const rawData = localStorage.getItem("ain_user_data");
    const localName = localStorage.getItem("ain_user_name");
    const localEmail = localStorage.getItem("ain_user_email");

    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        const cached = {
          name: parsed.name || localName || "Student",
          email: parsed.email || localEmail || "",
          phone_no: parsed.mobile_no || parsed.phone_no || parsed.phone || "+44 7300 000000",
          location: parsed.country || parsed.location || "United Kingdom",
          created_at: parsed.created_at || "2026-03-10",
        };
        setProfile(cached);
        setEditForm(cached);
      } catch {
        // use defaults
      }
    } else if (localName || localEmail) {
      const fallback = {
        name: localName || "Student",
        email: localEmail || "",
        phone_no: "+44 7300 000000",
        location: "United Kingdom",
        created_at: "2026-03-10",
      };
      setProfile(fallback);
      setEditForm(fallback);
    }

    // Load fresh data from server
    loadPageData(token);
  }, [router, loadPageData]); // ← fixed size — always 2 deps


  /* ── Handlers ── */
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem("ain_user_name", editForm.name);
    localStorage.setItem("ain_user_email", editForm.email);
    localStorage.setItem("ain_user_data", JSON.stringify(editForm));
    window.dispatchEvent(new Event("ain-auth-change"));
    toast.success("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("ain_auth_token");
    localStorage.removeItem("ain_user_name");
    localStorage.removeItem("ain_user_email");
    localStorage.removeItem("ain_user_data");
    window.dispatchEvent(new Event("ain-auth-change"));
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const handleRefreshOrders = () => {
    const token = localStorage.getItem("ain_auth_token");
    if (token) fetchOrders(token);
  };

  if (!isClient) return null;

  /* ── Derived data ── */
  const confirmedOrders = orderData?.confirmed_orders ?? [];
  const pendingLeads = orderData?.non_confirmed_leads ?? [];
  const summary = orderData?.summary;

  // Latest active confirmed order for the dashboard overview panel
  const latestActiveOrder = confirmedOrders.find(
    (o) => !o.status || (o.status !== "Cancelled" && o.status !== "Completed")
  );

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Cover Header */}
      <div className="h-44 md:h-56 bg-gradient-to-r from-[#1e3a5f] to-[#0f2a4a] relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(107,33,168,0.15),transparent)] pointer-events-none" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-[#3f159a] to-[#7e22ce] text-white flex items-center justify-center font-bold text-3xl shadow-[0_8px_20px_rgba(63,21,154,0.2)] mb-4">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-[#1e1b4b] truncate">{profile.name}</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold tracking-wide uppercase">UK Student Member</p>

              <div className="mt-5 border-t border-gray-100 pt-5 text-left space-y-3.5 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="truncate">{profile.phone_no}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="truncate">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="truncate">
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Side Nav */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-2">
              <nav className="flex flex-col gap-1">
                {(
                  [
                    { tab: "overview", icon: <User className="h-4 w-4" />, label: "Dashboard" },
                    { tab: "orders", icon: <FileText className="h-4 w-4" />, label: "My Orders" },
                    { tab: "edit-profile", icon: <Settings className="h-4 w-4" />, label: "Edit Profile" },
                    { tab: "rewards", icon: <Gift className="h-4 w-4" />, label: "Rewards & Offers" },
                    { tab: "security", icon: <Shield className="h-4 w-4" />, label: "Security Settings" },
                  ] as { tab: ActiveTab; icon: React.ReactNode; label: string }[]
                ).map(({ tab, icon, label }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-[#3f159a] text-white shadow-[0_4px_12px_rgba(63,21,154,0.15)]"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${activeTab === tab ? "rotate-90" : ""}`}
                    />
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all duration-300 mt-2"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6 min-h-[460px]">
              <AnimatePresence mode="wait">

                {/* ─── 1. Dashboard Overview ─── */}
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#1e1b4b]">
                        Welcome back, {profile.name}!
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Here is a quick summary of your academic assignments and tasks.
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="bg-gradient-to-tr from-purple-50 to-indigo-50 border border-purple-100 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[1.8rem] font-black text-[#3f159a]">
                            {ordersLoading ? "—" : (summary?.confirmed_count ?? 0)}
                          </span>
                          <h4 className="text-sm font-bold text-slate-700 mt-1">Confirmed Orders</h4>
                        </div>
                        <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
                          <ReceiptText className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-tr from-sky-50 to-cyan-50 border border-sky-100 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[1.8rem] font-black text-sky-700">
                            {ordersLoading ? "—" : (summary?.non_confirmed_count ?? 0)}
                          </span>
                          <h4 className="text-sm font-bold text-slate-700 mt-1">Pending Quotes</h4>
                        </div>
                        <div className="h-10 w-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700">
                          <Clock className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-100 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[1.8rem] font-black text-amber-700">10%</span>
                          <h4 className="text-sm font-bold text-slate-700 mt-1">Next Order Discount</h4>
                        </div>
                        <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                          <Award className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    {/* Latest Active Order Panel */}
                    {ordersLoading ? (
                      <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 flex items-center justify-center h-28">
                        <RefreshCw className="h-5 w-5 text-purple-400 animate-spin mr-2" />
                        <span className="text-sm text-gray-400">Loading your orders…</span>
                      </div>
                    ) : latestActiveOrder ? (
                      <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                          <div>
                            <StatusBadge status={latestActiveOrder.status} />
                            <h3 className="text-lg font-bold text-[#1e1b4b] mt-2">
                              {latestActiveOrder.order_id} • {latestActiveOrder.subject ?? latestActiveOrder.title ?? "Assignment"}
                            </h3>
                            {latestActiveOrder.title && (
                              <p className="text-sm text-gray-500 mt-1">{latestActiveOrder.title}</p>
                            )}
                          </div>
                          <div className="text-left md:text-right shrink-0">
                            <span className="text-xs text-gray-400 block">Delivery Date</span>
                            <span className="text-sm font-bold text-slate-700 block mt-0.5">
                              {latestActiveOrder.delivery_date
                                ? new Date(latestActiveOrder.delivery_date).toLocaleDateString(undefined, {
                                    year: "numeric", month: "short", day: "numeric",
                                  })
                                : "TBD"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            {latestActiveOrder.word_count && (
                              <div>
                                <span className="text-xs text-gray-400 block">Word Count</span>
                                <span className="font-semibold text-slate-800 mt-0.5 block">
                                  {Number(latestActiveOrder.word_count).toLocaleString()} words
                                </span>
                              </div>
                            )}
                            {latestActiveOrder.amount && (
                              <div>
                                <span className="text-xs text-gray-400 block">Amount</span>
                                <span className="font-semibold text-slate-800 mt-0.5 block">
                                  £{latestActiveOrder.amount}
                                </span>
                              </div>
                            )}
                            {latestActiveOrder.due_amount > 0 && (
                              <div>
                                <span className="text-xs text-gray-400 block">Due</span>
                                <span className="font-semibold text-red-600 mt-0.5 block">
                                  £{latestActiveOrder.due_amount}
                                </span>
                              </div>
                            )}
                          </div>
                          <Link
                            href="/order"
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#3f159a] hover:text-purple-900 border border-[#3f159a]/20 hover:border-[#3f159a] px-3.5 py-2 rounded-xl transition"
                          >
                            <Plus className="h-3.5 w-3.5" /> Order Another Assignment
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 text-center">
                        <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No active orders found.</p>
                        <Link href="/order" className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#3f159a] underline">
                          Place your first order →
                        </Link>
                      </div>
                    )}

                    {/* Referral Banner */}
                    <div className="bg-gradient-to-r from-purple-900 to-[#3f159a] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
                      <div className="space-y-1.5 relative z-10">
                        <span className="bg-amber-400 text-purple-950 font-bold text-[0.7rem] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Referral Program
                        </span>
                        <h3 className="text-xl text-purple-100 font-bold leading-snug">Invite friends & get £10 Reward Voucher</h3>
                        <p className="text-purple-100 text-xs leading-relaxed max-w-md">
                          Your friend gets 10% OFF on their first order. You get £10 voucher when their order is completed.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("rewards")}
                        className="btn-shutter-orange-open bg-amber-500 hover:bg-amber-600 text-[#1e1b4b] text-sm font-bold px-6 py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.2)] whitespace-nowrap shrink-0 relative z-10"
                      >
                        Share Code
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─── 2. My Orders ─── */}
                {activeTab === "orders" && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h2 className="text-2xl font-extrabold text-[#1e1b4b]">My Orders</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Track and manage your academic orders and files.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleRefreshOrders}
                          disabled={ordersLoading}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-2 rounded-xl transition disabled:opacity-50"
                          title="Refresh orders"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${ordersLoading ? "animate-spin" : ""}`} />
                          Refresh
                        </button>
                        <Link
                          href="/order"
                          className="btn-shutter-blue-open bg-[#3f159a] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg inline-flex items-center gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" /> New Order
                        </Link>
                      </div>
                    </div>

                    {/* Sub-tabs */}
                    <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit border border-slate-100">
                      <button
                        onClick={() => setOrderSubTab("confirmed")}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                          orderSubTab === "confirmed"
                            ? "bg-white text-[#3f159a] shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Confirmed
                        {summary && (
                          <span className="ml-1.5 bg-purple-100 text-purple-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                            {summary.confirmed_count}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setOrderSubTab("pending")}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                          orderSubTab === "pending"
                            ? "bg-white text-[#3f159a] shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Pending Quotes
                        {summary && (
                          <span className="ml-1.5 bg-amber-100 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                            {summary.non_confirmed_count}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Loading / Error States */}
                    {ordersLoading && (
                      <div className="flex items-center justify-center py-16 text-gray-400">
                        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-purple-400" />
                        <span className="text-sm">Loading orders…</span>
                      </div>
                    )}

                    {ordersError && !ordersLoading && (
                      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-400" />
                        <p className="text-sm text-gray-500">{ordersError}</p>
                        <button
                          onClick={handleRefreshOrders}
                          className="text-xs font-bold text-[#3f159a] underline"
                        >
                          Try again
                        </button>
                      </div>
                    )}

                    {/* ── Confirmed Orders Table ── */}
                    {!ordersLoading && !ordersError && orderSubTab === "confirmed" && (
                      <>
                        {confirmedOrders.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                            <FileText className="h-12 w-12 text-slate-200" />
                            <p className="text-sm text-gray-400">No confirmed orders yet.</p>
                            <Link href="/order" className="text-xs font-bold text-[#3f159a] underline">
                              Place your first order →
                            </Link>
                          </div>
                        ) : (
                          <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  <th className="py-4 px-5">Order</th>
                                  <th className="py-4 px-5">Status</th>
                                  <th className="py-4 px-5">Delivery</th>
                                  <th className="py-4 px-5">Amount</th>
                                  <th className="py-4 px-5 text-right">Files</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-sm text-gray-600">
                                {confirmedOrders.map((order) => (
                                  <tr key={order.order_db_id} className="hover:bg-slate-50/50 transition">
                                    <td className="py-4 px-5">
                                      <span className="font-bold text-[#1e1b4b] block text-xs">{order.order_id}</span>
                                      {order.subject && (
                                        <span className="text-xs text-purple-700 font-semibold block mt-0.5">{order.subject}</span>
                                      )}
                                      {order.title && (
                                        <p className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">{order.title}</p>
                                      )}
                                      <span className="text-[10px] text-gray-300 block mt-1">
                                        {new Date(order.created_at).toLocaleDateString(undefined, {
                                          year: "numeric", month: "short", day: "numeric",
                                        })}
                                      </span>
                                    </td>
                                    <td className="py-4 px-5">
                                      <StatusBadge status={order.status} />
                                    </td>
                                    <td className="py-4 px-5 whitespace-nowrap text-slate-600 text-xs">
                                      {order.delivery_date
                                        ? new Date(order.delivery_date).toLocaleDateString(undefined, {
                                            year: "numeric", month: "short", day: "numeric",
                                          })
                                        : <span className="text-gray-300">TBD</span>}
                                    </td>
                                    <td className="py-4 px-5 whitespace-nowrap">
                                      <span className="font-bold text-slate-800 block text-xs">
                                        {order.amount ? `£${order.amount}` : <span className="text-gray-300">—</span>}
                                      </span>
                                      {order.due_amount > 0 && (
                                        <span className="text-[10px] font-bold text-red-500 block mt-0.5">
                                          Due: £{order.due_amount}
                                        </span>
                                      )}
                                      {order.received_amount !== "0.00" && (
                                        <span className="text-[10px] text-green-600 block mt-0.5">
                                          Paid: £{order.received_amount}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-4 px-5 text-right whitespace-nowrap">
                                      {order.files && order.files.length > 0 ? (
                                        <a
                                          href={order.files[0]}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                                        >
                                          <Download className="h-3.5 w-3.5" /> Download
                                        </a>
                                      ) : (
                                        <span className="text-[10px] text-gray-300 font-medium">No files yet</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}

                    {/* ── Pending / Non-Confirmed Leads Table ── */}
                    {!ordersLoading && !ordersError && orderSubTab === "pending" && (
                      <>
                        {pendingLeads.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                            <CheckCircle className="h-12 w-12 text-slate-200" />
                            <p className="text-sm text-gray-400">No pending quotes. All orders are confirmed!</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  <th className="py-4 px-5">Order</th>
                                  <th className="py-4 px-5">Subject</th>
                                  <th className="py-4 px-5">Deadline</th>
                                  <th className="py-4 px-5">Quote</th>
                                  <th className="py-4 px-5 text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-sm text-gray-600">
                                {pendingLeads.map((lead) => (
                                  <tr key={lead.lead_id} className="hover:bg-slate-50/50 transition">
                                    <td className="py-4 px-5">
                                      <span className="font-bold text-[#1e1b4b] block text-xs">{lead.order_id}</span>
                                      <span className="text-[10px] text-gray-400 block mt-0.5">
                                        {lead.service} • {lead.work_type}
                                      </span>
                                      {lead.requirements && (
                                        <p className="text-[10px] text-gray-300 mt-1 max-w-[200px] truncate">{lead.requirements}</p>
                                      )}
                                      <span className="text-[10px] text-gray-300 block mt-1">
                                        {new Date(lead.created_at).toLocaleDateString(undefined, {
                                          year: "numeric", month: "short", day: "numeric",
                                        })}
                                      </span>
                                    </td>
                                    <td className="py-4 px-5">
                                      <span className="text-xs font-semibold text-purple-700">{lead.subject}</span>
                                      <span className="text-[10px] text-gray-400 block mt-0.5">
                                        {Number(lead.word_count).toLocaleString()} words
                                      </span>
                                    </td>
                                    <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-600">
                                      {new Date(lead.deadline).toLocaleDateString(undefined, {
                                        year: "numeric", month: "short", day: "numeric",
                                      })}
                                    </td>
                                    <td className="py-4 px-5 whitespace-nowrap">
                                      <span className="font-bold text-slate-800 text-xs">£{lead.price}</span>
                                    </td>
                                    <td className="py-4 px-5 text-right whitespace-nowrap">
                                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                        <Hourglass className="h-3 w-3" /> Awaiting Confirmation
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* ─── 3. Edit Profile ─── */}
                {activeTab === "edit-profile" && (
                  <motion.div
                    key="edit-profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#1e1b4b]">Edit Profile</h2>
                      <p className="text-sm text-gray-500 mt-1">Keep your contact and university details up to date.</p>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                          { label: "Full Name", type: "text", key: "name", value: editForm.name },
                          { label: "Email Address", type: "email", key: "email", value: editForm.email },
                          { label: "WhatsApp / Mobile Number", type: "text", key: "phone_no", value: editForm.phone_no },
                          { label: "Location / Country", type: "text", key: "location", value: editForm.location },
                        ].map(({ label, type, key, value }) => (
                          <div key={key} className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</label>
                            <input
                              type={type}
                              required
                              value={value}
                              onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#3f159a] transition outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end">
                        <button
                          type="submit"
                          className="btn-shutter-blue-open bg-[#3f159a] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition"
                        >
                          Save Profile Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ─── 4. Rewards ─── */}
                {activeTab === "rewards" && (
                  <motion.div
                    key="rewards"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#1e1b4b]">Rewards & Vouchers</h2>
                      <p className="text-sm text-gray-500 mt-1">Unlock credits, discount vouchers and check your points balance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="border border-purple-100 bg-purple-50/50 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 shrink-0">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">Your Referral Code</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Share with classmates for discounts</p>
                          </div>
                        </div>
                        <div className="bg-white border border-purple-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                          <span className="font-mono font-bold text-slate-700 uppercase tracking-widest pl-2">AIN-REF-419</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText("AIN-REF-419");
                              toast.success("Referral code copied to clipboard!");
                            }}
                            className="text-xs font-bold text-[#3f159a] hover:text-purple-900 border border-[#3f159a]/10 hover:border-[#3f159a] px-3 py-1.5 rounded-lg transition"
                          >
                            Copy Code
                          </button>
                        </div>
                      </div>

                      <div className="border border-amber-100 bg-amber-50/50 p-6 rounded-2xl flex flex-col justify-between h-full min-h-[140px]">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-800">Earned Points Balance</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Voucher credits earned</p>
                          </div>
                          <span className="text-xs font-bold text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded-md">Silver Tier</span>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <span className="text-3xl font-black text-amber-700">
                            120 <span className="text-xs font-semibold text-gray-500">Points</span>
                          </span>
                          <button
                            onClick={() => toast.success("You need 200 points to redeem a £20 voucher.")}
                            className="text-xs font-bold text-amber-800 hover:text-amber-900 border border-amber-800/10 hover:border-amber-800 px-3.5 py-2 rounded-xl transition"
                          >
                            Redeem Credit
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-800">Your Promo Coupons</h3>
                      {[
                        { emoji: "🎉", title: "40% OFF + Extra 10% OFF", sub: "Expires in 3 days • Applicable on all UK assignments", badge: "Auto Applied", code: null },
                        { emoji: "🎁", title: "SAVE20 - Extra 20% Discount", sub: "Applicable on all assignments • Valid indefinitely", badge: null, code: "SAVE20" },
                      ].map(({ emoji, title, sub, badge, code }) => (
                        <div key={title} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between hover:border-purple-200 transition">
                          <div className="flex items-center gap-3.5">
                            <span className="text-2xl">{emoji}</span>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                            </div>
                          </div>
                          {badge ? (
                            <span className="text-xs font-bold text-[#3f159a] bg-purple-50 px-2.5 py-1 rounded-lg shrink-0">{badge}</span>
                          ) : (
                            <button
                              onClick={() => { navigator.clipboard.writeText(code!); toast.success("Coupon code copied!"); }}
                              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline shrink-0"
                            >
                              Use Code
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─── 5. Security ─── */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#1e1b4b]">Security Settings</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage and update your password and authentication details.</p>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                      {[
                        { label: "Current Password", key: "currentPassword", value: passwordForm.currentPassword },
                        { label: "New Password", key: "newPassword", value: passwordForm.newPassword },
                        { label: "Confirm New Password", key: "confirmPassword", value: passwordForm.confirmPassword },
                      ].map(({ label, key, value }) => (
                        <div key={key} className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</label>
                          <input
                            type="password"
                            required
                            value={value}
                            onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#3f159a] transition outline-none"
                          />
                        </div>
                      ))}
                      <div className="pt-3 border-t border-gray-100 flex justify-end">
                        <button
                          type="submit"
                          className="btn-shutter-blue-open bg-[#3f159a] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
