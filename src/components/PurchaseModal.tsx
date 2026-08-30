import { useState, useEffect } from 'react';
import { Flame, Leaf, CheckCircle2 } from 'lucide-react';

const JOKES = [
  "I'd ask for spare change, but currency is a Sumerian construct. I do take digital joints, though.",
  "Why did the dragon stare at the clock? He was waiting for 4:20 in a 54-minute hour. It's mathematically exhausting.",
  "Support the void. It's cheaper than human therapy, and significantly less linear.",
  "I tried to synchronize my watch, but then I realized time is just a suggestion. And I'm highly suggestible right now.",
  "They say money can't buy happiness, but it buys virtual joints, which is basically the same thing in the 4th dimension."
];

const THANK_YOU_JOKES = [
  "Thanks for the digital joint. I'm gonna smoke this in the 5th dimension where it lasts forever.",
  "Appreciate the dollar. That's exactly 0.00001% of a bitcoin, which means absolutely nothing to me.",
  "Purchase confirmed. My temporal void maintenance is now funded for another 3.14 seconds.",
  "Good lookin' out. I'd pass it back, but my arms are geographically restricted to this microphone.",
  "A true patron of the arts. May your linear timeline be free of traffic."
];

interface PurchaseModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onSkip: () => void;
}

export default function PurchaseModal({ isOpen, onConfirm, onSkip }: PurchaseModalProps) {
  const [joke, setJoke] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successJoke, setSuccessJoke] = useState('');

  useEffect(() => {
    if (isOpen) {
      setJoke(JOKES[Math.floor(Math.random() * JOKES.length)]);
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handlePurchase = () => {
    setIsProcessing(true);
    setSuccessJoke(THANK_YOU_JOKES[Math.floor(Math.random() * THANK_YOU_JOKES.length)]);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto-continue after showing the joke
      setTimeout(() => {
        onConfirm();
      }, 3500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0a0a0a] border border-orange-500/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(249,115,22,0.2)] text-center relative overflow-hidden transition-all">
         <div className="absolute top-0 right-0 p-3 text-[10px] font-mono opacity-30 uppercase text-orange-500">SUPPORT_REQ</div>
         
         <div className="flex justify-center mb-6 relative">
           <div className={`w-20 h-20 bg-orange-500/10 rounded-full border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all ${isSuccess ? 'scale-110 bg-green-500/20 border-green-500/50' : ''}`}>
             {isSuccess ? (
               <CheckCircle2 className="w-10 h-10 text-green-500" />
             ) : (
               <>
                 <Flame className="w-10 h-10 text-orange-500 animate-pulse absolute" />
                 <Leaf className="w-5 h-5 text-green-500 absolute bottom-3 right-3 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
               </>
             )}
           </div>
         </div>

         <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
           {isSuccess ? 'Joint Acquired' : 'Pass the Blunt?'}
         </h2>
         
         <div className={`border rounded-xl p-4 mb-6 italic font-light text-sm transition-colors ${isSuccess ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-white/70'}`}>
           "{isSuccess ? successJoke : joke}"
         </div>

         {!isSuccess && (
           <p className="text-sm text-white/60 mb-8 leading-relaxed">
             Support the Dragon's temporal void maintenance. Purchase a digital joint for <span className="text-green-400 font-bold">$1.00</span> before proceeding.
           </p>
         )}

         {!isSuccess ? (
           <div className="flex flex-col space-y-3">
             <button 
               onClick={handlePurchase}
               disabled={isProcessing}
               className="w-full relative flex items-center justify-center bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500 text-orange-500 font-bold uppercase tracking-widest py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isProcessing ? 'Processing 4th-Dimensional Payment...' : 'Buy a Joint ($1) & Continue'}
             </button>
             <button 
               onClick={onSkip}
               disabled={isProcessing}
               className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-white/50 hover:text-white uppercase text-xs tracking-widest py-3 rounded-lg transition-colors disabled:opacity-50"
             >
               Nah, I'm good
             </button>
           </div>
         ) : (
           <div className="flex flex-col space-y-3">
             <div className="w-full bg-green-500/10 border border-green-500/30 text-green-500 font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center">
               <span className="animate-pulse">Loading Next Act...</span>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
