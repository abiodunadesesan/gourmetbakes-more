"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    initialValue?: string;
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    initialValue = "",
    onSearch,
    placeholder = "Search our delicious treats..."
}: SearchBarProps) {
    const [query, setQuery] = useState(initialValue);

    // Always keep the latest onSearch in a ref — this means the debounce effect
    // never needs `onSearch` as a dependency, eliminating a key leg of the reload loop.
    const onSearchRef = useRef(onSearch);
    useEffect(() => {
        onSearchRef.current = onSearch;
    });

    // Sync query if the URL-driven initialValue changes externally (e.g. clearing a filter)
    const prevInitial = useRef(initialValue);
    useEffect(() => {
        if (initialValue !== prevInitial.current) {
            prevInitial.current = initialValue;
            setQuery(initialValue);
        }
    }, [initialValue]);

    // Debounced search — ONLY fires when the user changes the input.
    // isMounted guard prevents firing onSearch("") on the very first render,
    // which would trigger router.push → searchParams change → re-render loop.
    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        const handler = setTimeout(() => {
            onSearchRef.current(query);
        }, 400);
        return () => clearTimeout(handler);
    }, [query]); // ← only depends on query, never on onSearch

    return (
        <div className="relative group w-full">
            <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                size={20}
            />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
