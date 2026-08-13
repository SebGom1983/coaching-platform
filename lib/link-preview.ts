// Fetches a thumbnail + provider name for a pasted link using each
// platform's public oEmbed endpoint. No API key required, and these
// endpoints are free to call directly from the browser.

export type LinkPreview = {
  thumbnail?: string;
  provider?: string;
};

const cache = new Map<string, LinkPreview | null>();

function buildOEmbedUrl(url: string): string | null {
  if (/youtube\.com|youtu\.be/.test(url)) {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  }
  if (/open\.spotify\.com/.test(url)) {
    return `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
  }
  if (/vimeo\.com/.test(url)) {
    return `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
  }
  return null;
}

export async function getLinkPreview(url: string): Promise<LinkPreview | null> {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url)!;

  const oembedUrl = buildOEmbedUrl(url);
  if (!oembedUrl) {
    cache.set(url, null);
    return null;
  }

  try {
    const res = await fetch(oembedUrl);
    if (!res.ok) throw new Error("oEmbed request failed");
    const data = await res.json();
    const preview: LinkPreview = {
      thumbnail: data.thumbnail_url,
      provider: data.provider_name,
    };
    cache.set(url, preview);
    return preview;
  } catch {
    cache.set(url, null);
    return null;
  }
}
