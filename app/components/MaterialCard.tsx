"use client";
import { useEffect, useState } from "react";
import { Material, MaterialType } from "@/lib/firebase";
import { getLinkPreview } from "@/lib/link-preview";
import { useLang } from "@/lib/i18n";

const typeKey: Record<MaterialType, string> = {
  video: "typeVideo",
  link: "typeLink",
  text: "typeText",
  homework: "typeHomework",
};

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function MaterialCard({
  material,
  onToggleHomework,
  onDelete,
}: {
  material: Material;
  onToggleHomework?: (m: Material) => void;
  onDelete?: (id: string) => void;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const { t } = useLang();
  const isHomework = material.type === "homework";
  const isDone = material.status === "done";

  useEffect(() => {
    let active = true;
    if (material.url) {
      getLinkPreview(material.url).then((p) => {
        if (active) setThumbnail(p?.thumbnail || null);
      });
    }
    return () => {
      active = false;
    };
  }, [material.url]);

  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition">
      {thumbnail && (
        <a href={material.url} target="_blank" rel="noopener noreferrer" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnail} alt="" className="w-full aspect-video object-cover" />
        </a>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-wide text-sageSoft bg-sage/15 px-2.5 py-1 rounded-full">
            {t(typeKey[material.type])}
          </span>

          {isHomework && onToggleHomework && (
            <button
              onClick={() => onToggleHomework(material)}
              className={`font-mono text-[11px] px-2.5 py-1 rounded-full transition ${
                isDone ? "bg-sage/20 text-sageSoft" : "bg-gold/15 text-gold"
              }`}
            >
              {isDone ? t("statusDone") : t("statusPending")}
            </button>
          )}
        </div>

        <h4 className="font-serif text-lg leading-snug mb-2">{material.title}</h4>

        {material.url && (
          <a
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold text-sm font-medium hover:underline mb-3"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {domainOf(material.url) || t("openLink")}
          </a>
        )}

        {material.description && (
          <p className="text-chalkDim text-sm leading-relaxed whitespace-pre-wrap">
            {material.description}
          </p>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(material.id)}
            className="text-xs text-muted hover:text-red-400 mt-4"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
