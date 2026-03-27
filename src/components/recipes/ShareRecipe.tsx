'use client';

import React from 'react';
import { Copy, Facebook, Twitter, Printer, Check } from 'lucide-react';

interface ShareRecipeProps {
    title: string;
}

export default function ShareRecipe({ title }: ShareRecipeProps) {
    const [copied, setCopied] = React.useState(false);

    const getUrl = () => typeof window !== 'undefined' ? window.location.href : '';

    const handleCopy = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(getUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const shareUrl = encodeURIComponent(getUrl());
    const shareTitle = encodeURIComponent(`Check out this recipe for ${title} on GourmetBakes & More!`);

    return (
        <div className="flex flex-wrap items-center gap-3 print:hidden">
            <span className="text-sm font-semibold text-slate-500 mr-2 uppercase tracking-wide">Share:</span>
            
            <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1877F2] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
            </a>

            <a 
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1DA1F2] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
            </a>

            <button
                onClick={handleCopy}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                title="Copy Link"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>

            <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium transition-colors"
                title="Print Recipe"
            >
                <Printer className="w-4 h-4" />
                <span>Print</span>
            </button>
        </div>
    );
}
