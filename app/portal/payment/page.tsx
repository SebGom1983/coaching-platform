"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

const PAYMENT_KEYS = [
  { bank: "Bancolombia", key: "80815929", preferred: true },
  { bank: "Nu", key: "@ZAZ929", preferred: false },
];

export default function PaymentPage() {
  const { t } = useLang();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  return (
    <>
      <h1 className="font-serif text-3xl mb-8">{t("navPayment")}</h1>

      <div className="bg-card border border-white/10 rounded-xl p-5">
        <p className="text-sm mb-3">{t("paymentTitle")}</p>
        <p className="text-chalkDim text-xs mb-4">{t("paymentBody")}</p>
        <div className="flex flex-col gap-2">
          {PAYMENT_KEYS.map((opt) => (
            <div
              key={opt.bank}
              className="flex items-center justify-between gap-3 bg-ink border border-white/10 rounded-lg px-3 py-2.5"
            >
              <div>
                <span className="text-sm font-medium">{opt.bank}</span>
                {opt.preferred && (
                  <span className="ml-2 font-mono text-[10px] text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                    {t("preferred")}
                  </span>
                )}
                <p className="font-mono text-xs text-chalkDim">{opt.key}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(opt.key);
                  setCopiedKey(opt.bank);
                  setTimeout(() => setCopiedKey(null), 2000);
                }}
                className="bg-gold/15 text-gold text-xs font-medium px-3 py-1.5 rounded-lg shrink-0"
              >
                {copiedKey === opt.bank ? t("copied") : t("copy")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
