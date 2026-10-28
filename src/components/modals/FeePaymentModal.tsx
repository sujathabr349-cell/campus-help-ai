import React, { useState } from 'react';
import { STUDENT_USER } from '../../services/supabase';

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeePaymentModal: React.FC<FeePaymentModalProps> = ({ isOpen, onClose }) => {
  const [paymentOption, setPaymentOption] = useState<'full' | 'inst1' | 'inst2'>('inst1');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'challan'>('upi');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const amounts = {
    full: 75000,
    inst1: 45000, // 60% of 75,000
    inst2: 30000, // 40% of 75,000
  };

  const selectedAmount = amounts[paymentOption];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      setTxnId(`SBI-${Date.now().toString().slice(-8)}`);
    }, 1200);
  };

  const resetModal = () => {
    setPaymentDone(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#000f1d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[20px]">account_balance_wallet</span>
            <div>
              <span className="font-semibold text-sm block leading-none">University Fee Counter</span>
              <span className="text-[10px] text-slate-400">SBI Collect &amp; Online Gateway</span>
            </div>
          </div>
          <button
            onClick={resetModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        {!paymentDone ? (
          <div className="overflow-y-auto p-5 bg-slate-50 flex-grow font-sans text-xs space-y-4">
            {/* Student Info Banner */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Student Account</span>
                <p className="font-bold text-slate-900 text-sm">{STUDENT_USER.name}</p>
                <p className="text-slate-500 text-[11px]">USN: {STUDENT_USER.idNumber} • BCA Sem 3</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Active Student
              </span>
            </div>

            {/* Installment Selection */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5 text-xs">
                Select Payment Structure (Circular No. ADM/2024/88)
              </label>
              <div className="space-y-2">
                <label className={`block p-3 rounded-xl border transition-all cursor-pointer ${
                  paymentOption === 'inst1' ? 'border-[#0051d5] bg-blue-50/70 shadow-sm' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === 'inst1'}
                      onChange={() => setPaymentOption('inst1')}
                      className="mt-0.5 text-[#0051d5] accent-[#0051d5]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">1st Installment (60%)</span>
                        <span className="font-bold text-blue-700 text-sm">₹45,000</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Due Date: <strong className="text-slate-800">October 25, 2024</strong> (Excludes late fee)
                      </p>
                    </div>
                  </div>
                </label>

                <label className={`block p-3 rounded-xl border transition-all cursor-pointer ${
                  paymentOption === 'inst2' ? 'border-[#0051d5] bg-blue-50/70 shadow-sm' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === 'inst2'}
                      onChange={() => setPaymentOption('inst2')}
                      className="mt-0.5 text-[#0051d5] accent-[#0051d5]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">2nd Installment (40%)</span>
                        <span className="font-bold text-blue-700 text-sm">₹30,000</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Due Date: <strong className="text-slate-800">December 10, 2024</strong>
                      </p>
                    </div>
                  </div>
                </label>

                <label className={`block p-3 rounded-xl border transition-all cursor-pointer ${
                  paymentOption === 'full' ? 'border-[#0051d5] bg-blue-50/70 shadow-sm' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === 'full'}
                      onChange={() => setPaymentOption('full')}
                      className="mt-0.5 text-[#0051d5] accent-[#0051d5]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Full Academic Year Tuition (100%)</span>
                        <span className="font-bold text-blue-700 text-sm">₹75,000</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Covers Semesters 3 &amp; 4 complete tuition
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'upi' ? 'border-[#0051d5] bg-blue-50 font-bold text-blue-800' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined block text-[20px] mb-0.5">qr_code_scanner</span>
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card' ? 'border-[#0051d5] bg-blue-50 font-bold text-blue-800' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined block text-[20px] mb-0.5">credit_card</span>
                  <span>Debit / NetBank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('challan')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'challan' ? 'border-[#0051d5] bg-blue-50 font-bold text-blue-800' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined block text-[20px] mb-0.5">receipt_long</span>
                  <span>SBI Challan</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="font-medium text-slate-700 block text-[11px]">Enter Virtual Payment Address (VPA)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                  />
                  <span className="px-2.5 py-2 rounded-lg bg-slate-100 text-[11px] text-slate-600 font-mono flex items-center">
                    Instant
                  </span>
                </div>
              </div>
            )}

            {/* Caution banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-700 mt-0.5">info</span>
              <span>
                Late fee penalty of <strong>₹50/day</strong> applies after the deadline. All transactions generate digitally verifiable receipts.
              </span>
            </div>
          </div>
        ) : (
          /* Payment Success View */
          <div className="p-6 bg-slate-50 flex-grow text-center font-sans space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Fee Payment Successful!</h3>
              <p className="text-slate-500 text-xs mt-1">Transaction Ref: <strong className="font-mono text-slate-800">{txnId}</strong></p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs shadow-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{STUDENT_USER.name} ({STUDENT_USER.idNumber})</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-800">
                  {paymentOption === 'inst1' ? '1st Installment (60%)' : paymentOption === 'inst2' ? '2nd Installment (40%)' : 'Full Year Tuition'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-blue-700 text-sm">₹{selectedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-700 font-bold">Accounts Clearance Granted</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          {!paymentDone ? (
            <>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Payable</span>
                <span className="font-bold text-slate-900 text-base">₹{selectedAmount.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="px-5 py-2.5 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Processing Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Pay</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => {
                  alert('Official Fee Challan PDF receipt downloaded!');
                  resetModal();
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Receipt</span>
              </button>
              <button
                onClick={resetModal}
                className="px-5 py-2 rounded-xl bg-[#0051d5] text-white font-semibold text-xs shadow-sm"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
