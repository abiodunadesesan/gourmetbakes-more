'use client';

import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
    buttonText?: string;
    className?: string;
    showIcon?: boolean;
}

export default function WhatsAppButton({
    phoneNumber,
    message = "Hi GourmetBakes",
    buttonText = "Open WhatsApp",
    className = "",
    showIcon = true
}: WhatsAppButtonProps) {
    const waLink = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-green-100",
                className
            )}
        >
            {showIcon && <MessageCircle size={20} />}
            <span>{buttonText}</span>
        </a>
    );
}
