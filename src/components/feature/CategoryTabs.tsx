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
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                onClick={() => onSelect("all")}
                className={cn(
                    "rounded-full whitespace-nowrap",
                    activeCategory === "all" && "bg-primary text-primary-foreground"
                )}
            >
                All Items
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        "rounded-full whitespace-nowrap",
                        activeCategory === category.id && "bg-primary text-primary-foreground"
                    )}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
}
