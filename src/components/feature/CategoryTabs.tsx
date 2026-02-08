"use client";

import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
    categories: Category[];
    activeCategory: string;
    onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
            <Button
                variant="ghost"
                onClick={() => onSelect("all")}
                className={cn(
                    "rounded-full px-6 transition-all duration-300 border",
                    activeCategory === "all"
                        ? "bg-brand-600 text-white border-brand-600 hover:bg-brand-700 hover:text-white shadow-md shadow-brand-100"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
            >
                All Items
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    variant="ghost"
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        "rounded-full px-6 transition-all duration-300 border",
                        activeCategory === category.id
                            ? "bg-brand-600 text-white border-brand-600 hover:bg-brand-700 hover:text-white shadow-md shadow-brand-100"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    )}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
}
