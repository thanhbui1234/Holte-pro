"use client";

import { useState, useTransition } from "react";
import { PageTitleBar } from "@/components/ui/PageTitleBar";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BlurFade } from "shared-ui";
import { createSupportFormAction } from "@/actions/support";

interface FormState {
  name: string;
  phone: string;
  date: string;
  message: string;
}

const INITIAL_FORM: FormState = { name: "", phone: "", date: "", message: "" };

export function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formRef, formVisible] = useScrollAnimation({ threshold: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    startTransition(async () => {
      const res = await createSupportFormAction({
        phone: form.phone,
        fullName: form.name,
        availableTime: form.date,
        reason: form.message,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || "An error occurred while sending the message");
      }
    });
  };

  return (
    <main>
      <PageTitleBar
        label="Contact Us"
        title="Begin your legacy"
        highlightWord="with us"
      />

      <section
        data-header-theme="light"
        className="relative bg-stone-100 px-5 py-10 md:px-12 md:py-14 lg:px-24 dark:bg-stone-900"
      >
        <div className="mx-auto max-w-2xl">
          <div
            ref={formRef as React.RefObject<HTMLDivElement>}
            style={{
              transform: formVisible ? "translateY(0)" : "translateY(40px)",
              opacity: formVisible ? 1 : 0,
              transition:
                "transform 800ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 800ms ease",
            }}
          >
            {submitted ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-10 text-center dark:border-stone-700 dark:bg-stone-800/50 dark:backdrop-blur-sm">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10">
                  <svg
                    className="h-7 w-7 text-amber-400 dark:text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-light text-stone-900 dark:text-white">
                  Message Received
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Thank you! We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <BlurFade delay={0.1} inView>
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8 dark:border-stone-700 dark:bg-stone-800/50 dark:shadow-none dark:backdrop-blur-sm"
                >
                  <div className="mb-4 grid gap-4 md:grid-cols-2">
                    <FormField
                      label="Your Name"
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                    />
                    <FormField
                      label="Phone Number"
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="0901234567"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div className="mb-4">
                    <FormField
                      label="Wedding Date"
                      id="contact-date"
                      name="date"
                      type="date"
                      placeholder=""
                      value={form.date}
                      onChange={handleChange}
                      disabled={isPending}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-400"
                    >
                      Tell us about your day
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="Share your vision, venue, and any special moments..."
                      value={form.message}
                      onChange={handleChange}
                      disabled={isPending}
                      className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-600 dark:bg-stone-700/50 dark:text-white dark:placeholder-stone-500"
                    />
                  </div>

                  {errorMsg && (
                    <div className="mb-4 text-center text-sm font-medium text-red-500">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="contact-submit"
                    disabled={isPending}
                    className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-medium uppercase tracking-widest text-stone-900 transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </BlurFade>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

function FormField({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-400"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:opacity-60 dark:border-stone-600 dark:bg-stone-700/50 dark:text-white dark:placeholder-stone-500"
      />
    </div>
  );
}
