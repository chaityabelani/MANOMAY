"use client";

import {
    AlertTriangle,
    CheckCircle2,
    Settings,
    FileJson,
    Terminal,
    ArrowRight,
    ShieldAlert,
    HelpCircle,
    Construction
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeSnippet } from "@/components/ui/code-snippet";
import { SolutionCard } from "@/components/troubleshoot/solution-card";
import Link from "next/link";

export default function DeploymentHelpPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-2 shadow-sm border border-red-200">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Troubleshooting Vercel 404
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Fix Deployment Errors
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Resolving the "404 NOT_FOUND" error when your build succeeds but the site doesn't load.
                    </p>
                </div>

                {/* Primary Fix Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm">1</span>
                        The Recommended Fix
                    </div>

                    <SolutionCard
                        title="Clear Root Directory Setting"
                        description="The most common cause is Vercel looking for your app in the wrong folder. Resetting the Root Directory path fixes this instantly."
                        icon={Settings}
                        variant="info"
                        className="bg-white"
                    >
                        <ol className="space-y-3 mt-4 text-sm text-slate-700 list-decimal list-inside marker:text-blue-600 marker:font-bold">
                            <li className="pl-2"><span className="font-medium">Go to Vercel Dashboard</span> → Select Project (MANOMAY)</li>
                            <li className="pl-2"><span className="font-medium">Navigate to Settings</span> → Tab: General</li>
                            <li className="pl-2"><span className="font-medium">Find 'Root Directory'</span> → <span className="text-red-600 font-bold bg-red-50 px-1 rounded">Delete any text</span> (Make it empty)</li>
                            <li className="pl-2"><span className="font-medium">Save & Redeploy</span> → Go to Deployments → Redeploy</li>
                        </ol>
                        <div className="mt-4 flex gap-3">
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                                <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                                    Open Vercel Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </SolutionCard>
                </section>

                {/* Alternative Fix Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-600 text-white text-sm">2</span>
                        Alternative: Code-Based Fix
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <SolutionCard
                            title="Add vercel.json"
                            description="Force Vercel to recognize this as a clean Next.js project by adding a configuration file to your root."
                            icon={FileJson}
                        >
                            <CodeSnippet
                                label="vercel.json"
                                code={`{
  "framework": "nextjs",
  "cleanUrls": true
}`}
                            />
                        </SolutionCard>

                        <SolutionCard
                            title="Verify Config"
                            description="Ensure your next.config.mjs is clean and doesn't have conflicting output settings."
                            icon={Construction}
                        >
                            <CodeSnippet
                                label="next.config.mjs"
                                code={`/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`}
                            />
                        </SolutionCard>
                    </div>
                </section>

                {/* Diagnosis Section */}
                <section className="bg-slate-900 rounded-3xl p-8 text-white space-y-8 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <ShieldAlert className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <HelpCircle className="w-6 h-6 text-blue-400" />
                            Understanding the "Root Cause"
                        </h2>
                        <p className="text-slate-300 leading-relaxed max-w-2xl">
                            A <strong>Build Success</strong> means your code compiled. A <strong>404 Error</strong> means Vercel can't find the compiled files.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-2 font-semibold text-green-400 mb-2">
                                    <CheckCircle2 className="w-4 h-4" /> Build Phase
                                </div>
                                <p className="text-sm text-slate-400">
                                    Runs <code className="bg-slate-900 px-1 py-0.5 rounded">next build</code>. Vercel finds package.json and compiles your TSX files into the .next folder.
                                </p>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-2 font-semibold text-red-400 mb-2">
                                    <AlertTriangle className="w-4 h-4" /> Serving Phase
                                </div>
                                <p className="text-sm text-slate-400">
                                    Looks for the output. If Root Directory is set to "manomay-kiosk" but code is in root, it looks in the wrong place.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center pt-8">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                            Back to Home
                        </Button>
                    </Link>
                </div>

            </div>
        </main>
    );
}
