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

// Fallback banner shown when a material has no real thumbnail (e.g. a
// TED/article link with no oEmbed image, a text note, or a homework item).
// Gives every card a consistent visual anchor instead of a blank top.
const placeholderStyle: Record<MaterialType, string> = {
  video: "from-gold/25 to-ink2",
  link: "from-sage/25 to-ink2",
  text: "from-sageSoft/20 to-ink2",
  homework: "from-gold/20 to-ink2",
};

function PlaceholderIcon({ type }: { type: MaterialType }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "video") {
    return (
      <svg {...common}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  }
  if (type === "homework") {
    return (
      <svg {...common}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </svg>
    );
  }
  // "link" and "text" — book/reading icon (TED talks, articles, notes)
  return (
    <svg {...common}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" />
    </svg>
  );
}

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
  onEdit,
  onDelete,
}: {
  material: Material;
  onToggleHomework?: (m: Material) => void;
  onEdit?: (m: Material) => void;
  onDelete?: (id: string) => void;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(material.thumbnailUrl || null);
  const { t } = useLang();
  const isHomework = material.type === "homework";
  const isDone = material.status === "done";

  useEffect(() => {
    let active = true;
    // A manually-set cover image always wins over the automatic oEmbed lookup.
    if (material.thumbnailUrl) {
      setThumbnail(material.thumbnailUrl);
      return;
    }
    if (material.url) {
      getLinkPreview(material.url).then((p) => {
        if (active) setThumbnail(p?.thumbnail || null);
      });
    } else {
      setThumbnail(null);
    }
    return () => {
      active = false;
    };
  }, [material.url, material.thumbnailUrl]);

  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition">
      {thumbnail ? (
        <a href={material.url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt="" className="max-w-full max-h-full object-contain" />
          </div>
        </a>
      ) : (
        <div
          className={`w-full aspect-[3/1] flex items-center justify-center bg-gradient-to-br ${placeholderStyle[material.type]} text-chalkDim/70`}
        >
          <PlaceholderIcon type={material.type} />
        </div>
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

        {(onEdit || onDelete) && (
          <div className="flex gap-4 mt-4">
            {onEdit && (
              <button
                onClick={() => onEdit(material)}
                className="text-xs text-muted hover:text-gold"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(material.id)}
                className="text-xs text-muted hover:text-red-400"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
