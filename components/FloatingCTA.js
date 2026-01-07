import React from 'react';

const FloatingCTA = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#111] border-t border-theme-yellow p-3 flex justify-center items-center z-50 shadow-lg shadow-yellow-500/20">
            <a
                href="https://cuthongthai.vn/bac-si-tai-chinh-chan-doan-suc-khoe-vi-tien-va-phac-do-dieu-tri/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-theme-yellow hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all uppercase tracking-wider text-base md:text-lg flex items-center gap-2"
            >
                💊 Đi Khám Bệnh "Viêm Ví"
            </a>
        </div>
    );
};

export default FloatingCTA;
