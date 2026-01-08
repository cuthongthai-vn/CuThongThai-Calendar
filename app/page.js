import HomeClient from './HomeClient';

export const metadata = {
    title: 'Lịch Kinh Tế & Tin Nóng 24/7 | Cú Thông Thái',
    description: 'Cập nhật tin tức kinh tế nóng hổi, lịch sự kiện tài chính và phân tích tác động thị trường (Vàng, Chứng Khoán, Forex) theo thời gian thực.',
    openGraph: {
        title: 'Cú Thông Thái - Theo dòng sự kiện kinh tế',
        description: 'Đầu tư nhẹ nhàng, kết quả huy hoàng. Cập nhật tin tức nhanh nhất.',
        images: ['/og-home.png'],
    },
};

export default function Home() {
    return <HomeClient />;
}
