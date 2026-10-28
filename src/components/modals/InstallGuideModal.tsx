import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Language } from '../../types/campus';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onTriggerInstall: () => Promise<boolean>;
  isInstallable: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  onTriggerInstall,
  isInstallable,
  isIOS,
  isAndroid,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'qr' | 'android' | 'ios' | 'share'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'qr'
  );
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentUrl = window.location.href;
      QRCode.toDataURL(currentUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#000f1d',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Campus Help AI - College Student Assistant',
          text: 'Install Campus Help AI on your phone for instant access to course details, circulars, fees, and exam updates!',
          url: appUrl,
        });
      } catch (err) {
        console.warn('Share cancelled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Open and install *Campus Help AI* on your phone: ${appUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const success = await onTriggerInstall();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] font-sans text-xs border border-slate-200/80">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000f1d] via-[#002b66] to-[#0051d5] text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#89f5e7] border border-white/20 shadow-inner">
              <span className="material-symbols-outlined text-[26px]">install_mobile</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm tracking-tight leading-tight">
                  {language === 'kn' ? 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' : 'Install on Your Phone'}
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-[#89f5e7] text-[#00201d] text-[9px] font-black uppercase tracking-wider">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                {language === 'kn'
                  ? 'ಕ್ಯಾಂಪಸ್ ಹೆಲ್ಪ್ ಎಐ ಅಪ್ಲಿಕೇಶನ್ • 1-ಟ್ಯಾಪ್ ಪ್ರವೇಶ'
                  : 'Add Campus Help AI directly to home screen'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 bg-slate-50/80 flex-grow">
          {/* Direct Install Banner if browser supports prompt */}
          {isInstallable && !installSuccess && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-3.5 shadow-md flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#89f5e7] text-[22px]">bolt</span>
                  <span className="font-bold text-sm">
                    {language === 'kn' ? 'ನೇರ 1-ಟ್ಯಾಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಲಭ್ಯವಿದೆ!' : '1-Tap Install Ready!'}
                  </span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed">
                {language === 'kn'
                  ? 'ಪ್ಲೇ ಸ್ಟೋರ್ ಇಲ್ಲದೆಯೇ ನಿಮ್ಮ ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಅಪ್ಲಿಕೇಶನ್ ಐಕಾನ್ ಸೇರಿಸಿ.'
                  : 'Click below to instantly install the app on your home screen without Play Store download.'}
              </p>
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full py-2.5 rounded-xl bg-white text-[#002b66] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isInstalling ? 'hourglass_top' : 'download_for_offline'}
                </span>
                <span>
                  {isInstalling
                    ? language === 'kn'
                      ? 'ಇನ್‌ಸ್ಟಾಲ್ ಆಗುತ್ತಿದೆ...'
                      : 'Prompting Install...'
                    : language === 'kn'
                    ? 'ಈಗಲೇ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ'
                    : 'Install App on Phone Now'}
                </span>
              </button>
            </div>
          )}

          {installSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-center text-emerald-800">
              <span className="material-symbols-outlined text-emerald-600 text-[28px] mb-1">
                check_circle
              </span>
              <p className="font-bold text-xs">
                {language === 'kn' ? 'ಅಪ್ಲಿಕೇಶನ್ ಯಶಸ್ವಿಯಾಗಿ ಇನ್‌ಸ್ಟಾಲ್ ಆಗಿದೆ!' : 'App Installed Successfully!'}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Check your home screen or app launcher for the Campus Help AI icon.
              </p>
            </div>
          )}

          {/* Tab Selector */}
          <div className="grid grid-cols-4 gap-1 bg-slate-200/80 p-1 rounded-2xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'qr' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
              <span>QR Code</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'android' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">android</span>
              <span>Android</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ios')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'ios' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">phone_iphone</span>
              <span>iPhone</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('share')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'share' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">share</span>
              <span>Share</span>
            </button>
          </div>

          {/* TAB 1: QR Code Scanner for Instant Phone Install */}
          {activeTab === 'qr' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center">
              <span className="font-bold text-slate-900 text-xs">
                {language === 'kn' ? 'ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : 'Scan with Your Phone Camera'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಕ್ಯಾಮೆರಾವನ್ನು ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ಕಡೆಗೆ ಹಿಡಿದು ಲಿಂಕ್ ತೆರೆಯಿರಿ:'
                  : 'Point your smartphone camera at this code to open the app on your phone immediately:'}
              </p>

              {/* QR Image */}
              <div className="mt-3 p-2 bg-white rounded-2xl border-2 border-slate-100 shadow-sm inline-block">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Campus Help AI Mobile QR Code"
                    className="w-44 h-44 rounded-xl object-contain mx-auto"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-slate-100 rounded-xl">
                    <span className="text-slate-400 text-xs">Generating QR...</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <span className="material-symbols-outlined text-[14px]">check</span>
                <span>Works on all Android &amp; iOS phone cameras</span>
              </div>
            </div>
          )}

          {/* TAB 2: Android Step-by-Step */}
          {activeTab === 'android' && (
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">android</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    {language === 'kn'
                      ? 'ಆಂಡ್ರಾಯ್ಡ್ ಫೋನ್‌ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುವ ಹಂತಗಳು:'
                      : 'How to Install on Android (Chrome / Brave):'}
                  </span>
                  <span className="text-[10px] text-slate-500">Google Chrome, Brave, Samsung Internet</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    {language === 'kn' ? (
                      <>ಕ್ರೋಮ್ ಬ್ರೌಸರ್‌ನ ಮೇಲ್ಭಾಗದಲ್ಲಿರುವ <strong>ಮೂರು ಚುಕ್ಕೆಗಳ ಮೆನು (⋮)</strong> ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.</>
                    ) : (
                      <>Open the app link in <strong>Chrome</strong> and tap the <strong>three dots menu (⋮)</strong> at top-right.</>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    {language === 'kn' ? (
                      <>ಮೆನುವಿನಲ್ಲಿ <strong>&apos;Install app&apos;</strong> ಅಥವಾ <strong>&apos;Add to Home screen&apos;</strong> ಆಯ್ಕೆಮಾಡಿ.</>
                    ) : (
                      <>Tap <strong>&apos;Install app&apos;</strong> (or <strong>&apos;Add to Home screen&apos;</strong>).</>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    {language === 'kn' ? (
                      <>ದೃಢೀಕರಿಸಲು <strong>&apos;Install&apos;</strong> ಬಟನ್ ಒತ್ತಿ. ಕ್ಯಾಂಪಸ್ ಆ್ಯಪ್ ನೇರವಾಗಿ ನಿಮ್ಮ ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ನಲ್ಲಿ ಬರುತ್ತದೆ!</>
                    ) : (
                      <>Tap <strong>&apos;Install&apos;</strong> in the confirmation box. The app icon will appear directly on your home screen!</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: iOS Step-by-Step */}
          {activeTab === 'ios' && (
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    {language === 'kn'
                      ? 'ಐಫೋನ್ / ಐಪ್ಯಾಡ್‌ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುವ ಹಂತಗಳು:'
                      : 'How to Install on iPhone / iPad (Safari):'}
                  </span>
                  <span className="text-[10px] text-slate-500">Apple Safari Browser</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    {language === 'kn' ? (
                      <>ಸಫಾರಿ (Safari) ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕೆಳಭಾಗದಲ್ಲಿರುವ <strong>Share ಬಟನ್ (⎋)</strong> ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.</>
                    ) : (
                      <>Open this link in <strong>Safari</strong> and tap the <strong>Share button (⎋)</strong> at the bottom bar.</>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    {language === 'kn' ? (
                      <>ಕೆಳಗೆ ಸ್ಕ್ರೋಲ್ ಮಾಡಿ <strong>&apos;Add to Home Screen&apos; (➕)</strong> ಆಯ್ಕೆಮಾಡಿ.</>
                    ) : (
                      <>Scroll down and tap <strong>&apos;Add to Home Screen&apos; (➕)</strong>.</>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    {language === 'kn' ? (
                      <>ಮೇಲಿನ ಬಲಭಾಗದಲ್ಲಿರುವ <strong>&apos;Add&apos;</strong> ಒತ್ತಿ. ಪೂರ್ಣ-ಸ್ಕ್ರೀನ್ ಆ್ಯಪ್ ಸಿದ್ಧವಾಗುತ್ತದೆ.</>
                    ) : (
                      <>Tap <strong>&apos;Add&apos;</strong> in the top-right corner. It will run in standalone full-screen like a native app!</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Share Link to Phone */}
          {activeTab === 'share' && (
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <span className="font-bold text-slate-900 text-xs block">
                {language === 'kn' ? 'ಫೋನ್‌ಗೆ ಲಿಂಕ್ ಕಳುಹಿಸಿ:' : 'Send App Link to Your Phone:'}
              </span>

              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Send to WhatsApp (Self / Chat)</span>
              </button>

              {/* Native Web Share */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  <span>Share via Phone Apps (Messages, Email, Telegram)</span>
                </button>
              )}

              {/* URL input and copy button */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 font-medium">Or copy app URL:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-[11px] font-mono text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Perks info badge */}
          <div className="bg-slate-100/90 p-3 rounded-2xl text-[10px] text-slate-600 space-y-1 border border-slate-200/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="material-symbols-outlined text-teal-700 text-[16px]">verified</span>
              <span>PWA Benefits for Students:</span>
            </div>
            <ul className="space-y-0.5 list-disc pl-4 text-slate-600">
              <li>Works offline when campus Wi-Fi drops.</li>
              <li>Runs in full-screen standalone mode without browser URL bars.</li>
              <li>Lightweight (&lt; 2MB) — saves mobile phone memory and battery.</li>
              <li>Immediate access to exam hall tickets, fees, and circulars.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>PWA Ready</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
