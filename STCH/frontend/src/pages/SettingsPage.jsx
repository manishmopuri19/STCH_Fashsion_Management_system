import { useEffect, useState } from "react";
import { Save, Loader2, Lock, User, Building2, CheckCircle2 } from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const ROLE_COLORS = {
  ADMIN:           "bg-red-500/10 text-red-400 border-red-500/20",
  MERCHANDISER:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  MEMBER:          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  SUPPLIER:        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  QUALITY_CONTROL: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function SettingsPage() {
  const { user, login } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  const [profile, setProfile] = useState({
    userName: "", email: "", phone: "", department: "", designation: "",
  });

  const [password, setPassword] = useState({
    current: "", next: "", confirm: "",
  });

  const [company, setCompany] = useState({
    company_name: "", phone: "", country: "", city: "",
    address: "", specialization: "", minimum_order_quantity: "", lead_time: "",
  });

  useEffect(() => {
    if (!user) return;
    API.get(`/users/${user.id}`)
      .then((r) => {
        const d = r.data;
        setProfile({
          userName:    d.userName    || "",
          email:       d.email       || "",
          phone:       d.phone       || "",
          department:  d.department  || "",
          designation: d.designation || "",
        });
      })
      .catch(console.error);

    if (user.role === "SUPPLIER" && user.supplier_id) {
      API.get(`/suppliers/${user.supplier_id}`)
        .then((r) => {
          const d = r.data;
          setCompany({
            company_name:           d.company_name           || "",
            phone:                  d.phone                  || "",
            country:                d.country                || "",
            city:                   d.city                   || "",
            address:                d.address                || "",
            specialization:         d.specialization         || "",
            minimum_order_quantity: d.minimum_order_quantity || "",
            lead_time:              d.lead_time              || "",
          });
        })
        .catch(console.error)
        .finally(() => setPageLoading(false));
    } else {
      setPageLoading(false);
    }
  }, [user]);

  const notify = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await API.patch(`/users/${user.id}`, {
        userName:    profile.userName,
        email:       profile.email,
        phone:       profile.phone       || null,
        department:  profile.department  || null,
        designation: profile.designation || null,
      });
      // Refresh auth context so topbar name updates instantly
      login({ ...user, userName: res.data.user.userName, email: res.data.user.email });
      notify("success", "Profile saved successfully.");
    } catch (err) {
      notify("error", err.response?.data?.detail || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (!password.next.trim()) return notify("error", "New password cannot be empty.");
    if (password.next.length < 8) return notify("error", "Password must be at least 8 characters.");
    if (password.next !== password.confirm) return notify("error", "Passwords do not match.");
    setSavingPassword(true);
    try {
      await API.patch(`/users/${user.id}`, { password: password.next });
      setPassword({ current: "", next: "", confirm: "" });
      notify("success", "Password changed successfully.");
    } catch (err) {
      notify("error", err.response?.data?.detail || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    try {
      await API.patch(`/suppliers/${user.supplier_id}`, {
        company_name:           company.company_name,
        phone:                  company.phone,
        country:                company.country,
        city:                   company.city,
        address:                company.address,
        specialization:         company.specialization,
        minimum_order_quantity: parseInt(company.minimum_order_quantity, 10) || 0,
        lead_time:              parseInt(company.lead_time, 10) || 0,
      });
      notify("success", "Company info saved.");
    } catch (err) {
      notify("error", err.response?.data?.detail || "Failed to save company info.");
    } finally {
      setSavingCompany(false);
    }
  };

  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-orange-500" size={36} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* TOAST */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {toast.type === "success" && <CheckCircle2 size={16} />}
            {toast.msg}
          </div>
        )}

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-lg font-semibold text-white">Settings</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Manage your profile and account preferences</p>
        </div>

        {/* ── PROFILE CARD ── */}
        <Card icon={User} iconColor="text-orange-400" iconBg="bg-orange-500/10" title="My Profile" subtitle="Your name, contact and role details">

          {/* Avatar + role */}
          <div className="flex items-center gap-4 p-4 bg-[#0F141D] rounded-2xl border border-[#2A3142]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
              {profile.userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-white font-semibold">{profile.userName}</p>
              <p className="text-zinc-500 text-sm">{profile.email}</p>
              <span className={`mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ROLE_COLORS[user?.role] || ROLE_COLORS.MEMBER}`}>
                {user?.role?.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="Full Name"    value={profile.userName}    onChange={(v) => setProfile({ ...profile, userName: v })} />
            <Field label="Email"        type="email" value={profile.email}       onChange={(v) => setProfile({ ...profile, email: v })} />
            <Field label="Phone"        value={profile.phone}       onChange={(v) => setProfile({ ...profile, phone: v })}       placeholder="+91 98765 43210" />
            <Field label="Department"   value={profile.department}  onChange={(v) => setProfile({ ...profile, department: v })}  placeholder="e.g. Merchandising" />
            <Field label="Designation"  value={profile.designation} onChange={(v) => setProfile({ ...profile, designation: v })} placeholder="e.g. Manager" className="sm:col-span-2" />
          </div>

          <SaveBtn loading={savingProfile} onClick={handleSaveProfile} label="Save Profile" />
        </Card>

        {/* ── CHANGE PASSWORD ── */}
        <Card icon={Lock} iconColor="text-yellow-400" iconBg="bg-yellow-500/10" title="Change Password" subtitle="Update your login password">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="New Password"     type="password" value={password.next}    onChange={(v) => setPassword({ ...password, next: v })}    placeholder="Min. 8 characters" />
            <Field label="Confirm Password" type="password" value={password.confirm} onChange={(v) => setPassword({ ...password, confirm: v })} placeholder="Re-enter new password" />
          </div>
          {password.next && password.confirm && password.next !== password.confirm && (
            <p className="text-xs text-red-400 mt-2">Passwords do not match</p>
          )}
          <SaveBtn loading={savingPassword} onClick={handleSavePassword} label="Update Password" />
        </Card>

        {/* ── COMPANY INFO (SUPPLIER only) ── */}
        {user?.role === "SUPPLIER" && (
          <Card icon={Building2} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" title="Company Information" subtitle="Your supplier profile visible to the team">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Name"   value={company.company_name}           onChange={(v) => setCompany({ ...company, company_name: v })}           className="sm:col-span-2" />
              <Field label="Phone"          value={company.phone}                  onChange={(v) => setCompany({ ...company, phone: v })} />
              <Field label="Specialization" value={company.specialization}         onChange={(v) => setCompany({ ...company, specialization: v })} />
              <Field label="Country"        value={company.country}                onChange={(v) => setCompany({ ...company, country: v })} />
              <Field label="City"           value={company.city}                   onChange={(v) => setCompany({ ...company, city: v })} />
              <Field label="Min. Order Qty" type="number" value={company.minimum_order_quantity} onChange={(v) => setCompany({ ...company, minimum_order_quantity: v })} placeholder="e.g. 500" />
              <Field label="Lead Time (days)" type="number" value={company.lead_time}            onChange={(v) => setCompany({ ...company, lead_time: v })}             placeholder="e.g. 30" />
              <Field label="Address"        value={company.address}                onChange={(v) => setCompany({ ...company, address: v })}                className="sm:col-span-2" />
            </div>
            <SaveBtn loading={savingCompany} onClick={handleSaveCompany} label="Save Company Info" />
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}

/* ── Small reusable pieces ─────────────────────────────────────────────────── */

function Card({ icon: Icon, iconColor, iconBg, title, subtitle, children }) {
  return (
    <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={17} className={iconColor} />
        </div>
        <div>
          <h2 className="text-white font-semibold">{title}</h2>
          <p className="text-zinc-500 text-xs">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-[#0F141D] border border-[#2A3142] text-white text-sm outline-none focus:border-orange-500 placeholder-zinc-600 transition-colors"
      />
    </div>
  );
}

function SaveBtn({ loading, onClick, label }) {
  return (
    <div className="pt-2 flex justify-end">
      <button
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold disabled:opacity-60 transition-all"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {loading ? "Saving…" : label}
      </button>
    </div>
  );
}
