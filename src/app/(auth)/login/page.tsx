import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="rounded-2xl border border-orange-200 bg-orange-50/60 px-10 py-16 shadow-sm max-w-md w-full">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-3">
                    Coming Soon
                </h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    We&apos;re working on a seamless login experience.<br />
                    Check back shortly!
                </p>
                <Link
                    href="/"
                    className="inline-block rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
