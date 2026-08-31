import { useState, useEffect } from 'react';
import { Flame, Leaf, CheckCircle2, Zap, ExternalLink } from 'lucide-react';

const JOKES = [
  "I'd ask for spare change, but currency is a Sumerian construct. I do take digital joints, though.",
  "Why did the dragon stare at the clock? He was waiting for 4:20 in a 54-minute hour. It's mathematically exhausting.",
  "Support the void. It's cheaper than human therapy, and significantly less linear.",
  "I tried to synchronize my watch, but then I realized time is just a suggestion. And I'm highly suggestible right now.",
  "They say money can't buy happiness, but it buys virtual joints, which is basically the same thing in the 4th dimension."
];

const THANK_YOU_JOKES = [
  "Joint sparked! Inhaling temporal cosmic smoke... enjoy the 5th dimension.",
  "Instant High activated! The dragon has ignited the ceremonial ether blunt.",
  "Thanks for the digital joint. I'm gonna smoke this in the 5th dimension where it lasts forever.",
  "Appreciate the patron love. That's exactly 0.00001% of a bitcoin, which means pure enlightenment to me.",
  "Purchase confirmed. Temporal void maintenance is now funded for another cosmic cycle."
];

interface PurchaseModalProps {
  isOpen: boolean;
  onConfirm: (didSmoke?: boolean) => void;
  onSkip: () => void;
}

export default function PurchaseModal({ isOpen, onConfirm, onSkip }: PurchaseModalProps) {
  const [joke, setJoke] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successJoke, setSuccessJoke] = useState('');
  const paypalAccount = 'fluidmotiontv@gmail.com';

  useEffect(() => {
    if (isOpen) {
      setJoke(JOKES[Math.floor(Math.random() * JOKES.length)]);
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handlePurchase = (isInstant = false) => {
    setIsProcessing(true);
    setSuccessJoke(THANK_YOU_JOKES[Math.floor(Math.random() * THANK_YOU_JOKES.length)]);
    
    // Simulate digital payment processing and trigger instant smoke effect
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto-continue after showing the joke and ignite stoner dragon smoke
      setTimeout(() => {
        onConfirm(true);
      }, 2000);
    }, isInstant ? 400 : 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0a0a0a] border border-orange-500/50 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(249,115,22,0.3)] text-center relative overflow-hidden transition-all">
         <div className="absolute top-0 right-0 p-3 text-[10px] font-mono opacity-40 uppercase text-orange-500">PAYPAL // VOID_D9</div>
         
         <div className="flex justify-center mb-5 relative">
           <div className={`w-20 h-20 bg-orange-500/10 rounded-full border border-orange-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all ${isSuccess ? 'scale-110 bg-green-500/20 border-green-500/60 shadow-[0_0_30px_rgba(34,197,94,0.6)]' : ''}`}>
             {isSuccess ? (
               <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
             ) : (
               <>
                 <Flame className="w-10 h-10 text-orange-500 animate-pulse absolute" />
                 <Leaf className="w-5 h-5 text-green-500 absolute bottom-3 right-3 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
               </>
             )}
           </div>
         </div>

         <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-1">
           {isSuccess ? '🔥 Joint Ignited & Smoked' : 'Pass the Blunt?'}
         </h2>
         
         <div className="text-[11px] font-mono text-orange-400/80 uppercase tracking-wider mb-4">
           {isSuccess ? '✦ Smoke Effect Triggered' : `PayPal Recipient: ${paypalAccount}`}
         </div>
         
         <div className={`border rounded-xl p-3.5 mb-5 italic font-light text-xs sm:text-sm transition-colors ${isSuccess ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-white/75'}`}>
           "{isSuccess ? successJoke : joke}"
         </div>

         {!isSuccess && (
           <p className="text-xs text-white/60 mb-6 leading-relaxed">
             Support the Dragon's temporal void maintenance. Purchase a digital joint for <span className="text-green-400 font-bold">$1.00</span> or trigger an <span className="text-orange-400 font-bold">Instant High</span> to spark smoke and continue!
           </p>
         )}

         {!isSuccess ? (
           <div className="flex flex-col space-y-2.5">
             <button 
               onClick={() => handlePurchase(true)}
               disabled={isProcessing}
               className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black uppercase text-xs sm:text-sm tracking-widest py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] disabled:opacity-50"
             >
               <Zap className="w-4 h-4 fill-black" />
               {isProcessing ? 'Sparking Joint...' : '⚡ Instant High (1-Click & Smoke)'}
             </button>

             <button 
               onClick={() => handlePurchase(false)}
               disabled={isProcessing}
               className="w-full relative flex items-center justify-center gap-2 bg-[#0070ba]/20 hover:bg-[#0070ba]/40 border border-[#0070ba] text-[#0070ba] hover:text-[#009cde] font-bold uppercase text-xs tracking-widest py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(0,112,186,0.3)]"
             >
               <ExternalLink className="w-3.5 h-3.5" />
               Buy Digital Joint via PayPal ($1.00)
             </button>

             <button 
               onClick={onSkip}
               disabled={isProcessing}
               className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-white/40 hover:text-white uppercase text-[11px] tracking-widest py-2 rounded-lg transition-colors disabled:opacity-50"
             >
               Nah, skip for now
             </button>
           </div>
         ) : (
           <div className="flex flex-col space-y-3">
             <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2">
               <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
               <span className="animate-pulse">Enjoying Smoke & Loading Next Act...</span>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
