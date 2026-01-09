'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    const navLinks = [
        { href: '/', label: '📅 Lịch Kinh Tế' },
        { href: '/macro', label: '📊 Vĩ Mô' },
        { href: '/assets', label: '💰 Tài Sản' },
        { href: '/lifestyle', label: '☕ Vỉa Hè' },
        { href: '/population', label: '👥 Dân Số', hot: true }
    ];

    return (
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

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${active
                                    ? 'text-[#fbbf24] scale-110'
                                    : 'text-slate-300 hover:text-[#fbbf24]'
                                    }`}
                            >
                                {link.label}
                                {link.hot && <span className="text-[10px] bg-blue-600 text-white px-1 rounded animate-pulse">Hot</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Mobile Navigation (Horizontal Scroll) */}
            <div className="md:hidden border-t border-slate-800 bg-slate-900/80 backdrop-blur">
                <nav className="flex items-center gap-6 overflow-x-auto px-4 py-3 whitespace-nowrap scrollbar-hide">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-all duration-200 flex items-center gap-1 ${active
                                    ? 'text-[#fbbf24] scale-105'
                                    : 'text-slate-300 hover:text-[#fbbf24]'
                                    }`}
                            >
                                {link.label}
                                {link.hot && <span className="text-[10px] bg-blue-600 text-white px-1 rounded animate-pulse">Hot</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
