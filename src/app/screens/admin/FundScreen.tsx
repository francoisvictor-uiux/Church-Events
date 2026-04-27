import { useState } from 'react';
import { TrendingUp, TrendingDown, X, Plus, Minus, Gift, Calendar, UtensilsCrossed, Printer, Bus, Briefcase, ArrowUp, ArrowDown } from 'lucide-react';
import { fundTransactions, currentUser } from '../../data/mockData';

type Tab = 'الكل' | 'دخل' | 'مصروف';
type Modal = null | 'in' | 'out';

const TypeIcon = ({ type, size = 20 }: { type: string; size?: number }) => {
  if (type === 'تبرع') return <Gift size={size} color="#014761" />;
  if (type === 'رسوم حدث') return <Calendar size={size} color="#014761" />;
  if (type === 'طعام') return <UtensilsCrossed size={size} color="#014761" />;
  if (type === 'طباعة') return <Printer size={size} color="#014761" />;
  if (type === 'أجرة') return <Bus size={size} color="#014761" />;
  return <Briefcase size={size} color="#014761" />;
};

export function FundScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('الكل');
  const [modal, setModal] = useState<Modal>(null);
  const user = currentUser.admin;

  const filtered = fundTransactions.filter((t) => {
    if (activeTab === 'دخل') return t.direction === 'in';
    if (activeTab === 'مصروف') return t.direction === 'out';
    return true;
  });

  const totalIn = fundTransactions.filter((t) => t.direction === 'in').reduce((s, t) => s + t.amount, 0);
  const totalOut = fundTransactions.filter((t) => t.direction === 'out').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col min-h-full pb-4 bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.25)' }}>
        <h1 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 700 }}>صندوق الخدمة</h1>

        {/* Balance */}
        <div className="bg-white/15 rounded-2xl p-5 text-center mb-4">
          <p className="text-white/70" style={{ fontSize: '0.8rem' }}>الرصيد الحالي</p>
          <p className="text-white" style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.2 }}>
            {user.fundBalance?.toLocaleString()}
          </p>
          <p className="text-white/70" style={{ fontSize: '0.8rem' }}>جنيه مصري</p>
        </div>

        {/* In/Out Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-2xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#16A34A]/30 flex items-center justify-center">
              <TrendingUp size={14} color="white" />
            </div>
            <div>
              <p className="text-white/70" style={{ fontSize: '0.68rem' }}>إجمالي الدخل</p>
              <p className="text-white" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{totalIn.toLocaleString()}ج</p>
            </div>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#DC2626]/30 flex items-center justify-center">
              <TrendingDown size={14} color="white" />
            </div>
            <div>
              <p className="text-white/70" style={{ fontSize: '0.68rem' }}>إجمالي المصروف</p>
              <p className="text-white" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{totalOut.toLocaleString()}ج</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setModal('in')}
            className="flex-1 py-3.5 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
            style={{ fontWeight: 600, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}
          >
            <Plus size={16} />
            تسجيل دخل
          </button>
          <button
            onClick={() => setModal('out')}
            className="flex-1 py-3.5 rounded-2xl border-2 border-[#DC2626]/30 text-[#DC2626] flex items-center justify-center gap-2"
            style={{ fontWeight: 600, fontSize: '0.88rem' }}
          >
            <TrendingDown size={16} />
            تسجيل مصروف
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1" style={{ boxShadow: '0 2px 8px rgba(1, 71, 97, 0.06)' }}>
          {(['الكل', 'دخل', 'مصروف'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl transition-all ${activeTab === tab ? 'bg-[#014761] text-white' : 'text-[#7A7A7A]'}`}
              style={{ fontSize: '0.82rem', fontWeight: activeTab === tab ? 700 : 500 }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="flex flex-col gap-3">
          {filtered.map((tx) => (
            <div key={tx.id} className="bg-white rounded-3xl p-4 flex items-center gap-3"
              style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                tx.direction === 'in' ? 'bg-[#16A34A]/10' : 'bg-[#DC2626]/10'
              }`}>
                <TypeIcon type={tx.type} size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{tx.type}</p>
                  {tx.direction === 'in' ? (
                    <span className="px-2 py-0.5 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center gap-1" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                      دخل <ArrowUp size={9} />
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg bg-[#DC2626]/10 text-[#DC2626] flex items-center gap-1" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                      مصروف <ArrowDown size={9} />
                    </span>
                  )}
                </div>
                {tx.notes && <p className="text-[#7A7A7A] mt-0.5" style={{ fontSize: '0.75rem' }}>{tx.notes}</p>}
                <p className="text-[#C4C4C4] mt-0.5" style={{ fontSize: '0.7rem' }}>{tx.date} • {tx.approvedBy}</p>
              </div>
              <span style={{
                fontSize: '1rem', fontWeight: 800,
                color: tx.direction === 'in' ? '#16A34A' : '#DC2626'
              }}>
                {tx.direction === 'in' ? '+' : '-'}{tx.amount}ج
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full bg-white rounded-t-[2rem] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {modal === 'in'
                  ? <><Plus size={18} color="#16A34A" /><h2 className="text-[#1C1C1C]" style={{ fontSize: '1.1rem', fontWeight: 700 }}>تسجيل دخل</h2></>
                  : <><Minus size={18} color="#DC2626" /><h2 className="text-[#1C1C1C]" style={{ fontSize: '1.1rem', fontWeight: 700 }}>تسجيل مصروف</h2></>
                }
              </div>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X size={16} color="#4A4A4A" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>النوع</label>
                <select className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C]" style={{ fontSize: '0.88rem' }}>
                  {modal === 'in' ? (
                    <>
                      <option>تبرع</option>
                      <option>رسوم حدث</option>
                      <option>أخرى</option>
                    </>
                  ) : (
                    <>
                      <option>طعام</option>
                      <option>طباعة</option>
                      <option>أجرة</option>
                      <option>مستلزمات</option>
                      <option>أخرى</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>المبلغ (جنيه) *</label>
                <input type="number" placeholder="0" className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C]"
                  style={{ fontSize: '0.88rem' }} />
              </div>

              <div>
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>ملاحظات</label>
                <input type="text" placeholder="سبب العملية..." className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C]"
                  style={{ fontSize: '0.88rem' }} />
              </div>

              <button
                onClick={() => setModal(null)}
                className={`w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 ${modal === 'in' ? 'bg-[#014761]' : 'bg-[#DC2626]'}`}
                style={{ fontWeight: 700, fontSize: '1rem' }}
              >
                {modal === 'in' ? <Plus size={16} /> : <Minus size={16} />}
                تأكيد {modal === 'in' ? 'الدخل' : 'المصروف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}