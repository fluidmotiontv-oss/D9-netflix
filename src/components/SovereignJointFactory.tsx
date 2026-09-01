import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, ShieldAlert, CheckCircle2, Zap, Award, Cannabis, Clock, ShoppingBag, Package, ExternalLink } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import SmokeEffect from './SmokeEffect';
import { playBambooClackSfx, playSingingBowlSfx } from '../audio/zenAudio';

interface SovereignJoint {
  id: string;
  number: number;
  name: string;
  rarity: 'Mythic' | 'Legendary' | 'Epic' | 'Rare' | 'Common';
  thc: string;
  terpene: string;
  solfeggioHz: number;
  price: number;
  isOwned: boolean;
  isSmoked: boolean;
  auctionType?: '3-Pack' | '6-Pack' | '9-Pack';
}

const GENERATE_COLLECTION = (): SovereignJoint[] => {
  const items: SovereignJoint[] = [];
  const strains = [
    'Quantum Myrcene Monolith', 'Tokyo Pine Void Roller', 'Sumerian Knuckle Diesel',
    'Dragon Lotus Gold Silk', 'Nebula Haze 54Hz', 'Cosmic Kush Washi', 'Solfeggio Sour Diesel',
    'Zen Bonsai OG', 'Tokyo Midnight Haze', 'Stoner Philosopher Pure'
  ];
  const rarities: ('Mythic' | 'Legendary' | 'Epic' | 'Rare' | 'Common')[] = [
    'Mythic', 'Legendary', 'Legendary', 'Epic', 'Epic', 'Epic', 'Rare', 'Rare', 'Rare', 'Common'
  ];
  const solfeggios = [432, 528, 639, 741, 852, 963];

  for (let i = 1; i <= 999; i++) {
    const strain = strains[i % strains.length];
    const rarity = i <= 9 ? 'Mythic' : i <= 50 ? 'Legendary' : i <= 200 ? 'Epic' : i <= 500 ? 'Rare' : 'Common';
    items.push({
      id: `joint-${i}`,
      number: i,
      name: `${strain} #${i.toString().padStart(3, '0')}`,
      rarity,
      thc: `${(30 + (i % 15) + (i % 7) * 0.1).toFixed(1)}%`,
      terpene: i % 2 === 0 ? 'Myrcene (99.4%)' : 'Caryophyllene (98.2%)',
      solfeggioHz: solfeggios[i % solfeggios.length],
      price: rarity === 'Mythic' ? 42.0 : rarity === 'Legendary' ? 19.99 : rarity === 'Epic' ? 9.99 : 4.20,
      isOwned: i <= 3, // First 3 owned by default
      isSmoked: false
    });
  }
  return items;
};

interface SovereignJointFactoryProps {
  onGainXp: (amount: number) => void;
  primaryColor?: string;
  accentColor?: string;
  auctionState?: {
    ninePacksRemaining: number;
    sixPacksRemaining: number;
    threePacksRemaining: number;
    ninePackPrice: number;
    sixPackPrice: number;
    threePackPrice: number;
  };
  auctionTimeLeft?: string;
  onPurchasePack?: (type: '9-pack' | '6-pack' | '3-pack') => void;
}

export default function SovereignJointFactory({
  onGainXp,
  primaryColor = '#10b981',
  accentColor = '#f59e0b',
  auctionState,
  auctionTimeLeft = '--:--:--',
  onPurchasePack
}: SovereignJointFactoryProps) {
  const [joints, setJoints] = useState<SovereignJoint[]>(() => {
    try {
      const saved = localStorage.getItem('dragon9_sovereign_999_joints');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return GENERATE_COLLECTION();
  });

  const [selectedJoint, setSelectedJoint] = useState<SovereignJoint | null>(joints[0]);
  const [filterRarity, setFilterRarity] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<{ title: string; price: number; type: 'single' | '3-pack' | '6-pack' | '9-pack'; count: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [smokeActive, setSmokeActive] = useState(false);
  const [smokedJointId, setSmokedJointId] = useState<string | null>(null);
  
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    try {
      localStorage.setItem('dragon9_sovereign_999_joints', JSON.stringify(joints));
    } catch (e) {}
  }, [joints]);

  const handlePurchaseAndSmoke = (target: { title: string; price: number; type: 'single' | '3-pack' | '6-pack' | '9-pack'; count: number }) => {
    setIsProcessing(true);
    playBambooClackSfx();

    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutSuccess(true);
      setSmokeActive(true);
      playSingingBowlSfx(528);

      // Mark unowned joints as owned and smoked for instant reward
      setJoints(prev => {
        let updated = [...prev];
        let count = 0;
        updated = updated.map(j => {
          if (!j.isOwned && count < target.count) {
            count++;
            return { ...j, isOwned: true, isSmoked: true };
          }
          return j;
        });
        return updated;
      });

      onGainXp(target.count * 350);
      if (onPurchasePack && target.type !== 'single') {
        onPurchasePack(target.type);
      }

      setTimeout(() => {
        setCheckoutSuccess(false);
        setShowCheckoutModal(false);
        setSmokeActive(false);
      }, 3500);
    }, 1500);
  };

  const handleSingleSmoke = (joint: SovereignJoint) => {
    if (joint.isSmoked) return;
    setSmokedJointId(joint.id);
    setSmokeActive(true);
    playSingingBowlSfx(joint.solfeggioHz);

    setTimeout(() => {
      setJoints(prev => prev.map(j => j.id === joint.id ? { ...j, isOwned: true, isSmoked: true } : j));
      onGainXp(500);
      setSmokedJointId(null);
      setSmokeActive(false);
    }, 2500);
  };

  const filteredJoints = joints.filter(j => {
    const matchesRarity = filterRarity === 'All' || j.rarity === filterRarity;
    const matchesSearch = j.name.toLowerCase().includes(searchTerm.toLowerCase()) || j.number.toString().includes(searchTerm);
    return matchesRarity && matchesSearch;
  });

  const totalPages = Math.ceil(filteredJoints.length / pageSize);
  const paginatedJoints = filteredJoints.slice((page - 1) * pageSize, page * pageSize);

  const ownedCount = joints.filter(j => j.isOwned).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Factory Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-black to-slate-950 border border-emerald-500/50 relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.2)]">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-400 font-mono text-xs uppercase tracking-widest hidden sm:block">
          FACTORY // 999_SOVEREIGN_GENESIS
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Cannabis className="w-3.5 h-3.5 text-emerald-400" />
                Sovereign Joint Factory (999 Minted)
              </span>
              <span className="text-xs font-mono text-amber-400">🔥 Daily Auctions: 3, 6 & 9 Packs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              The 999 Digital Joint Grimoire
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Explore and acquire uniquely numbered NFT-style digital joints. Use the <strong>Purchase & Smoke</strong> PayPal integration to instantly combust collectibles, trigger ambient smoke wisps, and harvest Solfeggio frequencies and XP bonuses.
            </p>
          </div>

          {/* Vault Stats & Quick Auction Cards */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="flex-1 lg:w-44 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Vault Status</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{ownedCount} / 999</div>
              <div className="text-[10px] text-emerald-300 font-mono mt-0.5">Collectibles Owned</div>
            </div>

            <div className="flex-1 lg:w-44 p-4 rounded-2xl bg-black/60 border border-amber-500/30 backdrop-blur-md relative overflow-hidden">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Next Auction Reset
              </div>
              <div className="text-xl font-black text-white mt-1 tabular-nums tracking-wider">{auctionTimeLeft}</div>
              <div className="text-[9px] text-white/50 font-mono mt-1">Prices +$1/joint on reset</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Auction Packs Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl bg-black/60 border ${auctionState?.threePacksRemaining === 0 ? 'border-red-500/30 opacity-70' : 'border-emerald-500/40'} flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">⚡ Flash Auction</div>
              <h4 className="text-lg font-black text-white mt-0.5">3-Pack Starter Genesis</h4>
              <p className="text-xs text-white/60">3 Uniquely numbered rare joints</p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-black ${auctionState?.threePacksRemaining === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {auctionState?.threePacksRemaining || 0}/9
              </div>
              <div className="text-[9px] text-white/50 font-mono uppercase">Remaining Today</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (auctionState?.threePacksRemaining === 0) return;
              setCheckoutTarget({ title: '3-Pack Starter Genesis', price: auctionState?.threePackPrice || 9.99, type: '3-pack', count: 3 });
              setShowCheckoutModal(true);
            }}
            disabled={auctionState?.threePacksRemaining === 0}
            className={`w-full py-2.5 rounded-xl font-black font-mono text-xs uppercase tracking-wider transition-all ${
              auctionState?.threePacksRemaining === 0 
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
            }`}
          >
            {auctionState?.threePacksRemaining === 0 ? 'Sold Out' : `Buy Now ($${(auctionState?.threePackPrice || 9.99).toFixed(2)})`}
          </button>
        </div>

        <div className={`p-5 rounded-2xl bg-black/60 border ${auctionState?.sixPacksRemaining === 0 ? 'border-red-500/30 opacity-70' : 'border-teal-500/40'} flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-mono text-teal-400 uppercase tracking-widest">🔥 Daily Featured</div>
              <h4 className="text-lg font-black text-white mt-0.5">6-Pack Master Sommelier</h4>
              <p className="text-xs text-white/60">6 Uniquely numbered epic joints</p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-black ${auctionState?.sixPacksRemaining === 0 ? 'text-red-400' : 'text-teal-400'}`}>
                {auctionState?.sixPacksRemaining || 0}/6
              </div>
              <div className="text-[9px] text-white/50 font-mono uppercase">Remaining Today</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (auctionState?.sixPacksRemaining === 0) return;
              setCheckoutTarget({ title: '6-Pack Master Sommelier', price: auctionState?.sixPackPrice || 14.99, type: '6-pack', count: 6 });
              setShowCheckoutModal(true);
            }}
            disabled={auctionState?.sixPacksRemaining === 0}
            className={`w-full py-2.5 rounded-xl font-black font-mono text-xs uppercase tracking-wider transition-all ${
              auctionState?.sixPacksRemaining === 0 
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
            }`}
          >
            {auctionState?.sixPacksRemaining === 0 ? 'Sold Out' : `Buy Now ($${(auctionState?.sixPackPrice || 14.99).toFixed(2)})`}
          </button>
        </div>

        <div className={`p-5 rounded-2xl bg-black/60 border ${auctionState?.ninePacksRemaining === 0 ? 'border-red-500/30 opacity-70' : 'border-amber-500/50'} flex flex-col justify-between`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-mono text-orange-400 uppercase tracking-widest">👑 VIP Sovereign</div>
              <h4 className="text-lg font-black text-white mt-0.5">9-Pack Mythic Bundle</h4>
              <p className="text-xs text-white/60">9 Uniquely numbered mythic joints</p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-black ${auctionState?.ninePacksRemaining === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                {auctionState?.ninePacksRemaining ?? 1440}/1440
              </div>
              <div className="text-[9px] text-white/50 font-mono uppercase">Remaining Today</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (auctionState?.ninePacksRemaining === 0) return;
              setCheckoutTarget({ title: '9-Pack Mythic Sovereign Bundle', price: auctionState?.ninePackPrice || 19.99, type: '9-pack', count: 9 });
              setShowCheckoutModal(true);
            }}
            disabled={auctionState?.ninePacksRemaining === 0}
            className={`w-full py-2.5 rounded-xl font-black font-mono text-xs uppercase tracking-wider transition-all ${
              auctionState?.ninePacksRemaining === 0 
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-orange-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]'
            }`}
          >
            {auctionState?.ninePacksRemaining === 0 ? 'Sold Out' : `Buy Now ($${(auctionState?.ninePackPrice || 19.99).toFixed(2)})`}
          </button>
        </div>
      </div>

      {/* Canvas Smoke Effect Preview if active */}
      {smokeActive && (
        <div className="relative my-6 animate-fade-in">
          <SmokeEffect active={true} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/90 border border-emerald-400 px-6 py-3 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.9)] text-emerald-300 font-mono text-sm uppercase tracking-widest animate-pulse">
              💨 Sovereign Purchase & Smoke Active! Solfeggio Frequencies Unlocked!
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['All', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Common'].map(r => (
            <button
              key={r}
              onClick={() => { setFilterRarity(r); setPage(1); playBambooClackSfx(); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                filterRarity === r
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search #001 or strain name..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* 999 Joints Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {paginatedJoints.map(joint => {
          const isSelected = selectedJoint?.id === joint.id;
          return (
            <div
              key={joint.id}
              onClick={() => { setSelectedJoint(joint); playBambooClackSfx(); }}
              className={`rounded-3xl border p-4 transition-all cursor-pointer overflow-hidden backdrop-blur-md flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                  : 'bg-black/50 border-white/10 hover:border-emerald-500/40 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-emerald-300 font-bold">
                  #{joint.number.toString().padStart(3, '0')}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border ${
                  joint.rarity === 'Mythic' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                  joint.rarity === 'Legendary' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' :
                  joint.rarity === 'Epic' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' :
                  joint.rarity === 'Rare' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' :
                  'bg-white/10 text-white/60 border-white/20'
                }`}>
                  {joint.rarity}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                <h4 className="text-base font-black text-white truncate">{joint.name}</h4>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60">
                  <span className="text-emerald-400">THC: {joint.thc}</span>
                  <span>•</span>
                  <span className="text-amber-400">{joint.solfeggioHz}Hz</span>
                </div>
                <div className="text-[11px] text-white/50">{joint.terpene}</div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-white/50">
                  {joint.isOwned ? (joint.isSmoked ? '✨ Smoked' : '🟢 Owned') : `$${joint.price.toFixed(2)}`}
                </span>

                {!joint.isSmoked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSingleSmoke(joint);
                    }}
                    disabled={smokedJointId === joint.id}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-orange-600 text-black font-black font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
                  >
                    <Flame className="w-3 h-3 fill-black" />
                    <span>{smokedJointId === joint.id ? 'Combusting...' : 'Purchase & Smoke'}</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Claimed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white disabled:opacity-30 hover:bg-white/10"
          >
            Prev
          </button>
          <span className="text-xs font-mono text-white/70">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white disabled:opacity-30 hover:bg-white/10"
          >
            Next
          </button>
        </div>
      )}

      {/* PayPal Simulated Checkout Modal */}
      {showCheckoutModal && checkoutTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0a0a0f] border border-orange-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_70px_rgba(249,115,22,0.3)] text-center relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono opacity-40 uppercase text-orange-500">
              PAYPAL // SOVEREIGN_CHECKOUT
            </div>

            <div className="flex justify-center mb-5">
              <div className={`w-20 h-20 bg-orange-500/10 rounded-full border border-orange-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)] ${checkoutSuccess ? 'bg-green-500/20 border-green-500/60' : ''}`}>
                {checkoutSuccess ? (
                  <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
                ) : (
                  <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
                )}
              </div>
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
              {checkoutSuccess ? '🎉 Sovereign Bundle Acquired!' : checkoutTarget.title}
            </h3>

            <div className="text-xs font-mono text-orange-400 mb-4">
              PayPal Recipient: <span className="text-white font-bold">fluidmotiontv@gmail.com</span> • Total: <span className="text-green-400 font-bold">${checkoutTarget.price.toFixed(2)}</span>
            </div>

            {!paypalClientId && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/70 mb-5 text-left space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Simulation Disclaimer</span>
                </div>
                <p className="leading-relaxed text-[11px] text-white/60">
                  Disclaimer: No PayPal Client ID configured. This is a simulated transaction within the Dragon Nine system. No real fiat currency or crypto is transferred. Upon confirmation, the <strong>SmokeEffect</strong> triggers instantly.
                </p>
              </div>
            )}

            {!checkoutSuccess ? (
              <div className="flex flex-col space-y-3">
                {paypalClientId ? (
                  <PayPalScriptProvider options={{ "clientId": paypalClientId, currency: "USD", intent: "capture" }}>
                    <div className="min-h-[150px] w-full flex flex-col justify-center">
                      <PayPalButtons 
                        style={{ layout: "vertical", color: "gold", shape: "pill", label: "checkout" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: checkoutTarget.price.toString()
                                },
                                description: checkoutTarget.title
                              }
                            ]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            try {
                              setIsProcessing(true);
                              const details = await actions.order.capture();
                              handlePurchaseAndSmoke(checkoutTarget);
                            } catch (err) {
                              console.error("PayPal Capture Error", err);
                              setIsProcessing(false);
                            }
                          }
                        }}
                        onError={(err) => {
                          console.error("PayPal Error", err);
                          setIsProcessing(false);
                        }}
                      />
                    </div>
                  </PayPalScriptProvider>
                ) : (
                  <>
                    <button
                      onClick={() => handlePurchaseAndSmoke(checkoutTarget)}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-orange-600 text-black font-black font-mono text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 fill-black" />
                      {isProcessing ? 'Processing Sovereign PayPal...' : `🔥 Purchase & Smoke Bundle ($${checkoutTarget.price})`}
                    </button>
                    <button
                      onClick={() => handlePurchaseAndSmoke(checkoutTarget)}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 bg-[#0070ba]/20 hover:bg-[#0070ba]/40 border border-[#0070ba] text-[#0070ba] font-bold font-mono text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,112,186,0.3)]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Simulate PayPal Gateway</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  disabled={isProcessing}
                  className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs font-bold uppercase tracking-widest rounded-xl animate-pulse">
                ✨ Success! Smoke Effect Playing & Vault Updated.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
