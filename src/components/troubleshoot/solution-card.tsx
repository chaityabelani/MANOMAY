"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SolutionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    variant?: "default" | "warning" | "success" | "info";
    className?: string;
    children?: React.ReactNode;
}

export function SolutionCard({
    title,
    description,
    icon: Icon,
    variant = "default",
    className,
    children
}: SolutionCardProps) {
    const variants = {
        default: "bg-white border-slate-200 hover:border-slate-300",
        warning: "bg-amber-50 border-amber-200 hover:border-amber-300",
        success: "bg-green-50 border-green-200 hover:border-green-300",
        info: "bg-blue-50 border-blue-200 hover:border-blue-300",
    };

    const iconColors = {
        default: "text-slate-600 bg-slate-100",
        warning: "text-amber-600 bg-amber-100",
        success: "text-green-600 bg-green-100",
        info: "text-blue-600 bg-blue-100",
    };

    return (
        <div className={cn(
            "group relative p-6 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md",
            variants[variant],
            className
        )}>
            <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 duration-300", iconColors[variant])}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {description}
                    </p>
                    {children && <div className="mt-4 pt-2">{children}</div>}
                </div>
            </div>
        </div>
    );
}
