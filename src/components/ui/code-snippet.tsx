"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeSnippetProps {
    code: string;
    label?: string;
    className?: string;
}

export function CodeSnippet({ code, label = "Terminal", className }: CodeSnippetProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 text-slate-50 my-4", className)}>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Terminal className="w-3 h-3" />
                    <span>{label}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded hover:bg-slate-800"
                    aria-label="Copy code to clipboard"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
