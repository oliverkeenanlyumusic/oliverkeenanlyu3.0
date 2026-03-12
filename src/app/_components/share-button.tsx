"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export function ShareButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    async function handleShare() {
        if (navigator.share) {
            try {
                await navigator.share({ url });
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
            }
        }
    }

    async function copyToClipboard() {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="mt-6 space-y-2">
            <button
                onClick={handleShare}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-xs uppercase tracking-widest text-white/40 transition-colors hover:border-white/20 hover:text-white/60"
            >
                <Share2 size={13} />
                <span>Share</span>
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span className="flex-1 truncate text-xs text-white/40">{url}</span>
                <button
                    onClick={copyToClipboard}
                    className="shrink-0 text-white/40 transition-colors hover:text-white/80"
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
            </div>
        </div>
    );
}