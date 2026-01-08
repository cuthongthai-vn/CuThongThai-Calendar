import "./globals.css";
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export const metadata = {
    title: "Cú Thông Thái - Economic Calendar",
    description: "Economic Calendar with AI Analysis",
};

import Link from 'next/link';

// ... imports

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            {/* Thêm suppressHydrationWarning={true} vào đây để trị lỗi Extension */}
            <body className={`${beVietnamPro.className} antialiased bg-slate-950 text-slate-100`} suppressHydrationWarning={true}>
                <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <img
                                src="/logo.png"
                                alt="Cú Thông Thái Logo"
                                className="h-10 w-auto object-contain hover:opacity-90 transition-opacity"
                            />
                        </Link>

                        {/* Navigation */}
                        <nav className="flex gap-6">
                            <Link
                                href="/"
                                className="text-sm font-semibold text-slate-300 hover:text-[#fbbf24] transition-colors"
                            >
                                📅 Lịch Kinh Tế
                            </Link>
                            <Link
                                href="/macro"
                                className="text-sm font-semibold text-slate-300 hover:text-[#fbbf24] transition-colors"
                            >
                                📊 Vĩ Mô
                            </Link>
                            <Link
                                href="/assets"
                                className="text-sm font-semibold text-slate-300 hover:text-[#fbbf24] transition-colors"
                            >
                                💰 Tài Sản
                            </Link>
                            <Link
                                href="/lifestyle"
                                className="text-sm font-semibold text-slate-300 hover:text-[#fbbf24] transition-colors flex items-center gap-1"
                            >
                                ☕ Vỉa Hè
                            </Link>
                            <Link
                                href="/population"
                                className="text-sm font-semibold text-slate-300 hover:text-[#fbbf24] transition-colors flex items-center gap-1"
                            >
                                👥 Dân Số
                                <span className="text-[10px] bg-blue-600 text-white px-1 rounded animate-pulse">Hot</span>
                            </Link>
                        </nav>
                    </div>
                </header>
                {children}
            </body>
        </html>
    );
}