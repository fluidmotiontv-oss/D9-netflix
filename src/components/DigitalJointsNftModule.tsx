import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, ShieldAlert, CheckCircle2, Zap, ExternalLink, Award, Cannabis, Music, Lock, Unlock } from 'lucide-react';
import SmokeEffect from './SmokeEffect';
import { playBambooClackSfx, playSingingBowlSfx } from '../audio/zenAudio';

interface DigitalJointNft {
  id: string;
  number: string;
  name: string;
  rarity: 'Mythic' | 'Legendary' | 'Epic' | 'Rare';
  thc: string;
  terpenes: string[];
  solfeggioHz: number;
  isOwned: boolean;
  isSmoked: boolean;
  revealedPrize?: {
    harmonicNote: string;
    bonusXp: number;
    secretPerk: string;
  };
}

const INITIAL_DIGITAL_JOINTS: DigitalJointNft[] = [
  {
    id: 'dj-001',
    number: '#001',
    name: 'Quantum Myrcene Monolith',
    rarity: 'Mythic',
    thc: '38.4%',
    terpenes: ['Myrcene (99.2%)', 'Linalool', 'Caryophyllene'],
    solfeggioHz: 528,
    isOwned: true,
    isSmoked: false
  },
  {
    id: 'dj-002',
    number: '#002',
    name: 'Tokyo Pine Void Roller',
    rarity: 'Legendary',
    thc: '34.2%',
    terpenes: ['Pinene', 'Terpinolene', 'Limonene'],
    solfeggioHz: 432,
    isOwned: true,
    isSmoked: false
  },
  {
    id: 'dj-003',
    number: '#003',
    name: 'Sumerian Knuckle Diesel',
    rarity: 'Epic',
    thc: '31.0%',
    terpenes: ['Caryophyllene', 'Humulene'],
    solfeggioHz: 639,
    isOwned: false,
    isSmoked: false
  },
  {
    id: 'dj-004',
    number: '#004',
    name: 'Dragon Lotus Gold Silk',
    rarity: 'Mythic',
    thc: '42.0%',
    terpenes: ['Ocimene', 'Myrcene', 'Eucalyptol'],
    solfeggioHz: 852,
    isOwned: false,
    isSmoked: false
  }
];

const HARMONIC_REWARDS = [
  {
    harmonicNote: "Frequency 528Hz: DNA Repair & Deep Bassline Resonance",
    bonusXp: 500,
    secretPerk: "Unlocked Secret Stage Mood: 'Neon Ether Midnight'"
  },
  {
    harmonicNote: "Frequency 432Hz: Universal Tuning & Heckler Immunity",
    bonusXp: 750,
    secretPerk: "Unlocked Bonus Archive: 'The 54-Minute Lost Set'"
  },
  {
    harmonicNote: "Frequency 639Hz: Interdimensional Connection & Crowd Empathy",
    bonusXp: 1000,
    secretPerk: "Unlocked Legendary Title: 'Master of the Quantum Bong'"
  }
];

interface DigitalJointsNftModuleProps {
  onGainXp: (amount: number) => void;
  primaryColor?: string;
  accentColor?: string;
}

export default function DigitalJointsNftModule({
  onGainXp,
  primaryColor = '#10b981',
  accentColor = '#f59e0b'
}: DigitalJointsNftModuleProps) {
  const [joints, setJoints] = useState<DigitalJointNft[]>(() => {
    try {
      const saved = localStorage.getItem('dragon9_digital_joint_nfts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DIGITAL_JOINTS;
  });

  const [selectedJoint, setSelectedJoint] = useState<DigitalJointNft | null>(joints[0]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [smokingJointId, setSmokingJointId] = useState<string | null>(null);
  const [smokeActive, setSmokeActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'vault' | 'market'>('vault');

  useEffect(() => {
    try {
      localStorage.setItem('dragon9_digital_joint_nfts', JSON.stringify(joints));
    } catch (e) {}
  }, [joints]);

  const handleSimulatedPayPalPurchase = (instant = false) => {
    setIsProcessingCheckout(true);
    playBambooClackSfx();

    setTimeout(() => {
      setIsProcessingCheckout(false);
      setCheckoutSuccess(true);
      setSmokeActive(true);
      playSingingBowlSfx(528);

      // Mint a new numbered joint into user's vault
      const nextNum = `#0' + (joints.length + 1).toString().padStart(3, '0')`;
      const newJoint: DigitalJointNft = {
        id: `dj-${Date.now()}`,
        number: `#0${joints.length + 1}`,
        name: `Super Puff Genesis Collector #${joints.length + 1}`,
        rarity: 'Mythic',
        thc: '42.0%',
        terpenes: ['Myrcene (100%)', 'Quantum Curing Vapor'],
        solfeggioHz: 963,
        isOwned: true,
        isSmoked: false
      };

      setJoints(prev => [newJoint, ...prev]);
      setSelectedJoint(newJoint);
      onGainXp(1000);

      setTimeout(() => {
        setCheckoutSuccess(false);
        setShowCheckoutModal(false);
        setSmokeActive(false);
      }, 3500);
    }, instant ? 600 : 1500);
  };

  const handleSmokeToReveal = (joint: DigitalJointNft) => {
    if (joint.isSmoked) return;
    setSmokingJointId(joint.id);
    setSmokeActive(true);
    playSingingBowlSfx(joint.solfeggioHz);

    setTimeout(() => {
      const reward = HARMONIC_REWARDS[Math.floor(Math.random() * HARMONIC_REWARDS.length)];
      setJoints(prev => prev.map(j => {
        if (j.id === joint.id) {
          return {
            ...j,
            isSmoked: true,
            revealedPrize: reward
          };
        }
        return j;
      }));
      onGainXp(reward.bonusXp);
      setSmokingJointId(null);
      setSmokeActive(false);
    }, 2500);
  };

  const ownedJoints = joints.filter(j => j.isOwned);
  const unownedJoints = joints.filter(j => !j.isOwned);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-black to-slate-950 border border-emerald-500/40 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400 font-mono text-xs uppercase tracking-widest">
          NFT // DRAGON_9_HARMONIC_NOTES
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Cannabis className="w-3.5 h-3.5 text-emerald-400" />
                Numbered Digital Joint NFTs
              </span>
              <span className="text-xs font-mono text-amber-400">🔥 Official Harmonic Notes Release</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              The Sovereign Stoned Grimoire Vault
            </h2>
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Collect numbered cryptographic digital joints. When you officially smoke them with the harmonic notes engine, they combust to reveal secret solfeggio frequencies, XP bonuses, and rare archival perks!
            </p>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black font-mono text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            Mint / Buy Joint ($4.20)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'vault'
              ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>My Vault ({ownedJoints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'market'
              ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Genesis Marketplace ({unownedJoints.length})</span>
        </button>
      </div>

      {/* Canvas Smoke Effect Preview if active */}
      {smokeActive && (
        <div className="relative mb-6 animate-fade-in">
          <SmokeEffect active={true} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/80 border border-emerald-400 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.8)] text-emerald-300 font-mono text-sm uppercase tracking-widest animate-pulse">
              💨 Harmonic Combustion in Progress... Revealing Secret Notes!
            </div>
          </div>
        </div>
      )}

      {/* Grid of Joint NFTs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(activeTab === 'vault' ? ownedJoints : joints).map((joint) => {
          const isSelected = selectedJoint?.id === joint.id;
          return (
            <div
              key={joint.id}
              onClick={() => {
                setSelectedJoint(joint);
                playBambooClackSfx();
              }}
              className={`relative rounded-3xl border p-5 transition-all cursor-pointer overflow-hidden backdrop-blur-md flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'bg-black/50 border-white/10 hover:border-emerald-500/50 hover:bg-white/5'
              }`}
            >
              {/* Top rarity & number badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-emerald-300 font-bold">
                  {joint.number}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border ${
                  joint.rarity === 'Mythic' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                  joint.rarity === 'Legendary' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' :
                  'bg-blue-500/20 text-blue-300 border-blue-500/50'
                }`}>
                  {joint.rarity}
                </span>
              </div>

              {/* Title & Specs */}
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-black text-white group-hover:text-emerald-200 transition-colors">
                  {joint.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    THC: {joint.thc}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Solfeggio: {joint.solfeggioHz}Hz
                  </span>
                </div>
                <div className="text-xs text-white/60 pt-1">
                  Terpenes: {joint.terpenes.join(', ')}
                </div>
              </div>

              {/* Revealed Prize / Status if smoked */}
              {joint.isSmoked && joint.revealedPrize && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Harmonic Prize Unlocked
                  </div>
                  <div className="text-xs text-white font-bold">{joint.revealedPrize.harmonicNote}</div>
                  <div className="text-[11px] text-amber-300 font-mono">+{joint.revealedPrize.bonusXp} XP • {joint.revealedPrize.secretPerk}</div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-white/50">
                  {joint.isOwned ? (joint.isSmoked ? '✨ Smoked & Claimed' : '🟢 Owned in Vault') : '🔒 Marketplace Genesis'}
                </span>

                {joint.isOwned && !joint.isSmoked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSmokeToReveal(joint);
                    }}
                    disabled={smokingJointId === joint.id}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-black font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all"
                  >
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>{smokingJointId === joint.id ? 'Combusting...' : 'Smoke & Reveal'}</span>
                  </button>
                )}

                {!joint.isOwned && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCheckoutModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>Mint ($4.20)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PayPal Simulated Checkout Modal with Disclaimer */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0a0a0f] border border-orange-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_70px_rgba(249,115,22,0.3)] text-center relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono opacity-40 uppercase text-orange-500">
              PAYPAL // SECURE_CHECKOUT_SIM
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
              {checkoutSuccess ? '🎉 Digital Joint Minted!' : 'Acquire Digital Joint NFT'}
            </h3>

            <div className="text-xs font-mono text-orange-400 mb-4">
              PayPal Recipient: <span className="text-white font-bold">fluidmotiontv@gmail.com</span> • Price: <span className="text-green-400 font-bold">$4.20</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/70 mb-5 text-left space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Simulation Disclaimer</span>
              </div>
              <p className="leading-relaxed text-[11px] text-white/60">
                Disclaimer: This is a simulated transaction within the Dragon Nine system. No real fiat currency, crypto, or blockchain gas fees are transferred.
              </p>
            </div>

            {!checkoutSuccess ? (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleSimulatedPayPalPurchase(true)}
                  disabled={isProcessingCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black font-mono text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  {isProcessingCheckout ? 'Minting Cryptographic Joint...' : '⚡ Instant High Checkout ($4.20)'}
                </button>

                <button
                  onClick={() => handleSimulatedPayPalPurchase(false)}
                  disabled={isProcessingCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-[#0070ba]/20 hover:bg-[#0070ba]/40 border border-[#0070ba] text-[#0070ba] font-bold font-mono text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,112,186,0.3)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Pay via PayPal Secure Gateway</span>
                </button>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  disabled={isProcessingCheckout}
                  className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs font-bold uppercase tracking-widest rounded-xl animate-pulse">
                ✨ Mint Successful! Smoke Effect Triggered & Added to Vault.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
