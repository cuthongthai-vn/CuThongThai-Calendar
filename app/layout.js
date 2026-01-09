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

// ... imports
import Navigation from '../components/layout/Navigation';

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            {/* Thêm suppressHydrationWarning={true} vào đây để trị lỗi Extension */}
            <body className={`${beVietnamPro.className} antialiased bg-slate-950 text-slate-100`} suppressHydrationWarning={true}>
                <Navigation />
                {children}
            </body>
        </html>
    );
}