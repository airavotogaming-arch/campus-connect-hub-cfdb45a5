import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, Mail, Phone, IdCard, GraduationCap, CalendarDays, Save } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PortalSidebar } from "@/components/portal/Sidebar";
import { useProfile } from "@/components/portal/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Student Complaint Portal" },
      { name: "description", content: "View and update your student profile details." },
      { property: "og:title", content: "My Profile — Student Complaint Portal" },
      { property: "og:description", content: "View and update your student profile details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { profile, save } = useProfile();
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => setForm(profile), [profile]);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    const next = {
      ...form,
      name: form.name.trim(),
      rollNo: form.rollNo.trim(),
      course: form.course.trim(),
      year: form.year.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    const nextErrors: Partial<Record<keyof typeof form, string>> = {};
    if (next.name.length < 2 || next.name.length > 80) nextErrors.name = "Enter a valid name (2–80 characters).";
    if (next.rollNo.length < 2 || next.rollNo.length > 30) nextErrors.rollNo = "Enter a valid roll number.";
    if (next.course.length < 2 || next.course.length > 100) nextErrors.course = "Enter a valid course.";
    if (next.year.length < 1 || next.year.length > 30) nextErrors.year = "Enter a valid year.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email) || next.email.length > 255) nextErrors.email = "Enter a valid email address.";
    if (!/^\+?[0-9 ()-]{7,20}$/.test(next.phone)) nextErrors.phone = "Enter a valid phone number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please check the highlighted details.");
      return;
    }
    const initials = next.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    save({ ...next, initials: initials || "ST" });
    toast.success("Profile updated");
  }

  const fields = [
    { key: "name" as const, label: "Full Name", icon: User, placeholder: "Your full name" },
    { key: "rollNo" as const, label: "Roll Number", icon: IdCard, placeholder: "e.g. CS2023-114" },
    { key: "course" as const, label: "Course", icon: GraduationCap, placeholder: "e.g. B.Tech - Computer Science" },
    { key: "year" as const, label: "Year", icon: CalendarDays, placeholder: "e.g. 3rd Year" },
    { key: "email" as const, label: "Email", icon: Mail, placeholder: "you@campus.edu" },
    { key: "phone" as const, label: "Phone", icon: Phone, placeholder: "+91 ..." },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <PortalSidebar
        active="Profile"
        onSelect={(label) => {
          if (label === "Settings") navigate({ to: "/settings" });
          else if (label !== "Profile") navigate({ to: "/student" });
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-3xl flex-1 space-y-5 p-4 md:p-8">
          <section className="flex items-center gap-5 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-warm)] md:p-8">
            <span className="flex size-20 items-center justify-center rounded-full bg-primary/15 font-display text-2xl font-extrabold text-primary">
              {profile.initials}
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.course} · {profile.year}
              </p>
              <p className="text-sm text-muted-foreground">Roll No: {profile.rollNo}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              <h2 className="font-display text-lg font-extrabold">Profile Details</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep your details up to date so the administration can reach you.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <f.icon className="size-3.5" />
                    {f.label}
                  </span>
                  <Input
                    id={`profile-${f.key}`}
                    type={f.key === "email" ? "email" : f.key === "phone" ? "tel" : "text"}
                    autoComplete={f.key === "name" ? "name" : f.key === "email" ? "email" : f.key === "phone" ? "tel" : "off"}
                    maxLength={f.key === "email" ? 255 : f.key === "course" ? 100 : 80}
                    value={form[f.key]}
                    onChange={(e) => {
                      set(f.key, e.target.value);
                      setErrors((current) => ({ ...current, [f.key]: undefined }));
                    }}
                    placeholder={f.placeholder}
                    aria-invalid={Boolean(errors[f.key])}
                    aria-describedby={errors[f.key] ? `profile-${f.key}-error` : undefined}
                    className="h-11 rounded-xl bg-muted/40"
                  />
                  {errors[f.key] ? (
                    <span id={`profile-${f.key}-error`} className="mt-1 block text-xs font-medium text-destructive">
                      {errors[f.key]}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>

            <Button
              onClick={handleSave}
              className="mt-6 h-11 rounded-full px-6 font-bold shadow-[var(--shadow-warm)]"
            >
              <Save className="size-4" />
              Save Changes
            </Button>
          </section>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
