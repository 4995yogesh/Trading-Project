import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C0E15] border-t border-[#2A2E39]">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Social links */}
        <div className="flex items-center gap-4 mb-6">
          {['Twitter', 'YouTube', 'Instagram', 'Telegram', 'TikTok', 'Reddit', 'Discord', 'LinkedIn'].map((social) => (
            <a
              key={social}
              href="#"
              className="text-[#787B86] hover:text-[#D1D4DC] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#1E222D] hover:bg-[#2A2E39] flex items-center justify-center transition-colors">
                <span className="text-[9px] font-bold">{social.slice(0, 2)}</span>
              </div>
            </a>
          ))}
        </div>

        {/* App store badges */}
        <div className="flex items-center gap-3 mb-6">
          <button className="flex items-center gap-2 bg-[#1E222D] hover:bg-[#2A2E39] rounded-lg px-4 py-2 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#787B86">
              <path d="M12.2 8.5c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.8C2.2 3.1.7 4.2.7 6.9c0 4 2.9 7.3 5.2 7.3 1.2 0 2.2-.8 3.1-.8.9 0 1.7.8 3 .8s2.9-2.3 3.5-3.5c-2.3-1.1-2.3-3.2-2.3-3.2z" />
            </svg>
            <div className="text-left">
              <div className="text-[8px] text-[#787B86]">Download on the</div>
              <div className="text-[11px] text-[#D1D4DC] font-medium">App Store</div>
            </div>
          </button>
          <button className="flex items-center gap-2 bg-[#1E222D] hover:bg-[#2A2E39] rounded-lg px-4 py-2 transition-colors">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="#787B86">
              <path d="M0 .5v15l7-7.5L0 .5zm8.5 6.5L2.5 0h.5l7 3.5-1.5 3.5zm0 2L2.5 16h.5l7-3.5L8.5 9zm2-1l3 1.5-3 1.5V8z" />
            </svg>
            <div className="text-left">
              <div className="text-[8px] text-[#787B86]">GET IT ON</div>
              <div className="text-[11px] text-[#D1D4DC] font-medium">Google Play</div>
            </div>
          </button>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2A2E39] pt-5">
          <div className="flex items-center gap-3">
            <svg width="24" height="14" viewBox="0 0 36 20" fill="none">
              <path d="M14 0L14 6L20 6L20 0L14 0Z" fill="#2962FF" />
              <path d="M14 7L14 20L20 20L20 7L14 7Z" fill="#2962FF" />
              <path d="M21 4L21 20L27 20L27 4L21 4Z" fill="#2962FF" />
              <path d="M28 0L28 20L34 20L34 0L28 0Z" fill="#2962FF" />
              <path d="M0 10L0 20L6 20L6 10L0 10Z" fill="#2962FF" />
              <path d="M7 6L7 20L13 20L13 6L7 6Z" fill="#2962FF" />
            </svg>
            <span className="text-[12px] text-[#787B86]">© {currentYear} TradingView, Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
