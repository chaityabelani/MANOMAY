'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * TableNumberInput Component
 * 
 * Allows users to manually input their table number with integer validation.
 * Updates the URL query parameter (?table=X) when a valid table number is submitted.
 * 
 * Features:
 * - Input validation: Only accepts positive integers
 * - Visual feedback for invalid input
 * - Styled with brand colors (Orange-600 primary, Slate text)
 */
export default function TableNumberInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTable = searchParams.get('table') || '1';

    const [inputValue, setInputValue] = useState(currentTable);
    const [error, setError] = useState('');

    /**
     * Validates that input is a positive integer
     */
    const validateTableNumber = (value: string): boolean => {
        const num = parseInt(value, 10);
        return !isNaN(num) && num > 0 && num.toString() === value.trim();
    };

    /**
     * Handles input change with validation
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Clear error when user is typing
        if (error) {
            setError('');
        }
    };

    /**
     * Handles form submission
     * Updates URL with new table number if valid
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateTableNumber(inputValue)) {
            setError('Please enter a valid table number (positive integer)');
            return;
        }

        // Update URL query parameter
        const params = new URLSearchParams(searchParams.toString());
        params.set('table', inputValue);
        router.push(`?${params.toString()}`);

        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <label htmlFor="table-input" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                        Table #:
                    </label>
                    <input
                        id="table-input"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={inputValue}
                        onChange={handleInputChange}
                        className={`w-20 px-3 py-1.5 border rounded-lg text-center font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent ${error
                                ? 'border-red-500 bg-red-50'
                                : 'border-slate-300 bg-white'
                            }`}
                        aria-label="Table number"
                        aria-invalid={!!error}
                        aria-describedby={error ? 'table-error' : undefined}
                    />
                    <button
                        type="submit"
                        className="px-4 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition shadow-sm"
                    >
                        Set
                    </button>
                </div>
                {error && (
                    <p id="table-error" className="text-xs text-red-600 mt-1" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </form>
    );
}
