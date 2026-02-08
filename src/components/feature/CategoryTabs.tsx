"use client";

import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
    categories: Category[];
    activeCategory: string;
    onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar items-center">
            <button
                onClick={() => onSelect("all")}
                className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border",
                    activeCategory === "all"
                        ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-600"
                )}
            >
                All Items
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border",
                        activeCategory === category.id
                            ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200"
                            : "bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-600"
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
