"use client";

import { X, Download, Printer, CheckCircle, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Profile, Subscription } from "@/lib/types";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  profile: Profile;
}

export function InvoiceModal({ isOpen, onClose, subscription, profile }: InvoiceModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${new Date(subscription.created_at).getFullYear()}-${subscription.id.replace(/[^0-9]/g, "").slice(0, 5) || "88219"}`;
  const baseAmount = Math.round(subscription.amount / 1.18);
  const gstAmount = Math.round(subscription.amount - baseAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 animate-fade-in print:p-0 print:bg-white overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-0 print:rounded-none my-auto">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Tax Invoice #{invoiceNumber}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              Paid
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto print:overflow-visible space-y-8 bg-white text-slate-900">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  MD
                </div>
                <h2 className="text-xl font-black text-slate-900">MyDigiCatalogue Technologies</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                GSTIN: 07AABCM9921D1ZK<br />
                Cyber Hub, DLF Phase 2, Gurugram, Haryana - 122002<br />
                support@mydigicatalogue.com
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">TAX INVOICE</span>
              <p className="text-lg font-black font-mono text-slate-800">{invoiceNumber}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Date: {new Date(subscription.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">Billed To:</p>
              <h4 className="font-extrabold text-sm text-slate-900">{profile.firm_name}</h4>
              <p className="text-slate-600 mt-1 whitespace-pre-line">{profile.address || "Digital Merchant"}</p>
              <p className="text-slate-600 mt-0.5">Email: {profile.email}</p>
              <p className="text-slate-600">Phone: {profile.phone}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">Payment Details:</p>
              <p className="text-slate-700"><strong>Gateway:</strong> Razorpay (UPI/Cards)</p>
              <p className="text-slate-700"><strong>Order ID:</strong> {subscription.razorpay_order_id || "N/A"}</p>
              <p className="text-slate-700"><strong>Payment ID:</strong> {subscription.razorpay_payment_id || "N/A"}</p>
              <p className="text-slate-700"><strong>Valid Till:</strong> {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-center">HSN/SAC</th>
                  <th className="py-2.5 text-right">Taxable Value</th>
                  <th className="py-2.5 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-slate-900">
                      MyDigiCatalogue Pro Subscription ({subscription.plan === "monthly" ? "1 Month" : "3 Months"})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Digital catalogue hosting, QR codes, 100-product inventory, WhatsApp ordering
                    </p>
                  </td>
                  <td className="py-3 text-center font-mono">998313</td>
                  <td className="py-3 text-right font-semibold">{formatCurrency(baseAmount)}</td>
                  <td className="py-3 text-right font-bold text-slate-900">{formatCurrency(baseAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="border-t border-slate-200 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-semibold">{formatCurrency(baseAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%):</span>
                <span className="font-semibold">{formatCurrency(Math.round(gstAmount / 2))}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%):</span>
                <span className="font-semibold">{formatCurrency(Math.round(gstAmount / 2))}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
                <span>Total Paid:</span>
                <span className="text-blue-600">{formatCurrency(subscription.amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-100 pt-6 text-[11px] text-slate-400 text-center space-y-1">
            <p>This is a computer-generated invoice and requires no physical signature.</p>
            <p>Thank you for powering your digital store with MyDigiCatalogue!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
