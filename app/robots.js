export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api/'], // Hide admin and API from crawlers
        },
        sitemap: 'https://cuthongthai.vn/sitemap.xml',
    };
}
