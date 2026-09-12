import React, { useState, useMemo } from 'react';
import { 
  Vote, 
  TrendingUp, 
  Award, 
  Shield, 
  MessageSquare, 
  Scale, 
  DollarSign, 
  Flame, 
  Users, 
  ArrowRight, 
  Volume2, 
  Briefcase,
  UserCheck
} from 'lucide-react';
import { StrainConnoisseurItem } from '../data';
import { playCrowdLaughterSfx } from '../audio/hecklerAudio';

interface PoliticianModeProps {
  composure: number;
  comedyXp: number;
  setComedyXp: React.Dispatch<React.SetStateAction<number>>;
  activeStrain: StrainConnoisseurItem;
  isBrutalMode: boolean;
  onLogEvent: (
    type: 'heckle' | 'crowd_reaction' | 'roast' | 'act_change' | 'strain_change' | 'brutal_event' | 'meltdown' | 'politician_event',
    label: string,
    details?: string,
    sentiment?: 'positive' | 'negative' | 'neutral',
    metadata?: Record<string, any>
  ) => void;
  primaryColor: string;
  accentColor: string;
}

export default function PoliticianMode({
  composure,
  comedyXp,
  setComedyXp,
  activeStrain,
  isBrutalMode,
  onLogEvent,
  primaryColor,
  accentColor
}: PoliticianModeProps) {
  // Policy Allocations
  const [policyDecrim, setPolicyDecrim] = useState(50);
  const [policyTime, setPolicyTime] = useState(50);
  const [policySpeech, setPolicySpeech] = useState(50);
  
  // Demographics Focus
  const [targetDemography, setTargetDemography] = useState<'hippies' | 'tech-bros' | 'corporate' | 'hecklers'>('tech-bros');

  // Campaign States
  const [approvalRating, setApprovalRating] = useState(54.2);
  const [campaignFunds, setCampaignFunds] = useState(1200);
  const [swingVoters, setSwingVoters] = useState(25.0);
  
  // Logical Poll Results
  const [superPuffPoll, setSuperPuffPoll] = useState(52.5);
  const [opponentPoll, setOpponentPoll] = useState(47.5);
  const [hasPolled, setHasPolled] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  // Demographics Detail Support
  const [demographics, setDemographics] = useState({
    hippies: 65,
    techBros: 58,
    corporate: 35,
    hecklers: 40
  });

  // Debate System
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [completedDebates, setCompletedDebates] = useState<number[]>([]);
  const [debateMessage, setDebateMessage] = useState<string | null>(null);

  const debateQuestions = [
    {
      id: 1,
      question: "How can you logically justify taking 6 minutes out of every hour with your '54-Minute Standard Hour' initiative?",
      options: [
        {
          label: "Compress Existential Waste",
          text: "We don't lose time, we shed administrative overhead! By compressing the hour to 54 minutes, we speed up reality itself, aligning human output with quantum clock speeds.",
          effect: { techBros: 15, hippies: -10, corporate: 5, approval: 4.5, funds: 150 },
          logHeadline: "DEBATE: Puff declares timezone hours 'existentially bloated', tech support surges!",
          logDetails: "Super Puff proposed purging the 6-minute 'existential drag' from the standard hour, winning massive support among Silicon Valley engineers."
        },
        {
          label: "The Lighter Time Correction",
          text: "6 minutes is the precise average duration spent finding a misplaced lighter. Decriminalize standard lighter attachments and the universe aligns itself naturally!",
          effect: { hippies: 20, techBros: -5, hecklers: 10, approval: 6.0, funds: 50 },
          logHeadline: "DEBATE: Candidate Puff ties timezone math directly to lighter search times!",
          logDetails: "Super Puff connected Chronological Standardisation directly to stoner ergonomics, scoring a major victory among local counter-culture coalitions."
        }
      ]
    },
    {
      id: 2,
      question: "The opposition claims your campaign is literally run by a group of highly animated stoner dragons. Are you too relaxed to govern?",
      options: [
        {
          label: "Zen Leadership Model",
          text: "A relaxed leader is a peaceful leader. My opponent Senator Hecklemore hasn't slept soundly since 2012. I operate in full, transparent, stress-free zen. No backroom wars, only light and sound.",
          effect: { hippies: 15, corporate: 12, techBros: 5, approval: 5.2, funds: 200 },
          logHeadline: "DEBATE: Puff outlines stress-free Zen Leadership Platform!",
          logDetails: "Super Puff contrasts his serene composure with his opponent's chronic hyper-stress, earning praise from wellness councils and corporate boardrooms."
        },
        {
          label: "The Dragon Cave Expansion",
          text: "If we are dragons, then the government is a damp cave. We aren't here to hoard gold; we are here to bring the fire to warm the citizens! Sparking up is standard public service.",
          effect: { hippies: 18, hecklers: 15, corporate: -10, approval: 3.8, funds: 100 },
          logHeadline: "DEBATE: Puff pledges to spark standard fire to 'warm the public cavern'!",
          logDetails: "Puff embraced his draconic nature, promising high-temperature public works that thrilled advocates but startled high-bracket bondholders."
        }
      ]
    },
    {
      id: 3,
      question: "What is your stance on the rising tide of 3AM comedy cellar disruptions? Should heckling be protected by the constitution?",
      options: [
        {
          label: "Organic Heckler Feedback",
          text: "Heckling is pure organic customer feedback! I protect the heckler's constitutional right to speak, but I reserve the candidate's right to roast them into fine atmospheric dust.",
          effect: { hecklers: 25, hippies: 5, corporate: -5, approval: 5.8, funds: 75 },
          logHeadline: "DEBATE: Puff defends hecklers but claims constitutional right to incinerate!",
          logDetails: "Super Puff championed absolute free speech, stating heckles are welcome raw material for thermonuclear stand-up retaliation."
        },
        {
          label: "Zero Tolerance Smoke Blaster",
          text: "Zero tolerance! Any unauthorized tomato or timing disruption on my stage will be met with immediate, high-pressure organic smoke blast confinement. Order must prevail.",
          effect: { corporate: 18, hippies: 10, hecklers: -15, approval: 4.2, funds: 250 },
          logHeadline: "DEBATE: Candidate Puff promises immediate 'Smoke Blast' law and order!",
          logDetails: "Super Puff promised aggressive stage containment zones for hostile hecklers, securing strong support from theater proprietors and security blocks."
        }
      ]
    }
  ];

  // News ticker headlines
  const newsTickerHeadlines = useMemo(() => [
    "POLL: 94% of stage hands endorse Super Puff's proposal for free vaporizers in the green room.",
    "BREAKING: Senator Hecklemore accused of keeping standard 60-minute clocks behind closed doors.",
    "LATEST: Standard hour standardization could solve global time-zone paradoxes, study finds.",
    "SWING STATE DATA: Terpinolene vapors in the ventilation ducts increase voter alignment by 14.2%.",
    "DEBATE UPDATE: Super Puff's composure remains at record levels despite hostile inquiries."
  ], []);

  // Compute Logical Vote Polls
  const handleCalculatePolls = () => {
    // Audit log generation
    const logs: string[] = [];
    logs.push("Initializing Logically-Weighted Voting Machine...");

    // 1. Base Support calculations
    let hippiesBase = demographics.hippies;
    let techBrosBase = demographics.techBros;
    let corporateBase = demographics.corporate;
    let hecklersBase = demographics.hecklers;

    // 2. Policy Focus Alignment
    // Decrim favors hippies, alienates corporate
    const decrimImpact = (policyDecrim - 50) * 0.3;
    hippiesBase += decrimImpact * 1.5;
    corporateBase -= decrimImpact * 1.2;
    logs.push(`Decriminalization platform focus (${policyDecrim}%) adjusted Hippie support by ${decrimImpact >= 0 ? '+' : ''}${(decrimImpact * 1.5).toFixed(1)}%.`);

    // Time standardisation (54m hour) favors tech bros, confuses hippies
    const timeImpact = (policyTime - 50) * 0.4;
    techBrosBase += timeImpact * 1.8;
    hippiesBase -= timeImpact * 0.8;
    logs.push(`54-Minute Hour Platform focus (${policyTime}%) shifted Tech Bro support by ${timeImpact >= 0 ? '+' : ''}${(timeImpact * 1.8).toFixed(1)}%.`);

    // Speech protection (order/anarchy balance)
    const speechImpact = (policySpeech - 50) * 0.3;
    corporateBase += speechImpact * 1.6; // high order = corporate support
    hecklersBase -= speechImpact * 1.8; // high order = hecklers angry
    logs.push(`Anti-Disruption speech focus (${policySpeech}%) altered Corporate support by ${speechImpact >= 0 ? '+' : ''}${(speechImpact * 1.6).toFixed(1)}%.`);

    // 3. Demographic Focus Campaigning
    if (targetDemography === 'hippies') {
      hippiesBase += 8;
      corporateBase -= 3;
      logs.push("Active campaigning in Woodstock Meadow boosted Hippie enthusiasm (+8.0%).");
    } else if (targetDemography === 'tech-bros') {
      techBrosBase += 9;
      hippiesBase -= 2;
      logs.push("Hosting hackathons in the Metaverse increased Tech Bro alignment (+9.0%).");
    } else if (targetDemography === 'corporate') {
      corporateBase += 10;
      hecklersBase -= 5;
      logs.push("Attending standard boardroom panels boosted high-bracket confidence (+10.0%).");
    } else if (targetDemography === 'hecklers') {
      hecklersBase += 12;
      corporateBase -= 6;
      logs.push("Doing raw 3am cellar sets solidified anti-establishment base (+12.0%).");
    }

    // 4. Cannabis Strain Modifiers
    logs.push(`Analyzing chemical charisma of current strain: ${activeStrain.name}...`);
    const terpenes = activeStrain.terpenes || [];
    const terpeneNames = terpenes.map(t => t.name || '');
    if (terpeneNames.some(name => name.includes('Myrcene') || name.includes('Linalool'))) {
      hippiesBase += 7;
      techBrosBase -= 2;
      logs.push(`• Relaxing Terpenes (Myrcene/Linalool) boost Hippie trust (+7.0%) but slow Tech Bro momentum.`);
    }
    if (terpeneNames.some(name => name.includes('Limonene') || name.includes('Pinene'))) {
      techBrosBase += 8;
      corporateBase += 4;
      logs.push(`• Focused Terpenes (Limonene/Pinene) boost Tech Bro timezone alignment (+8.0%).`);
    }
    if (activeStrain.thc.includes('High') || parseFloat(activeStrain.thc) > 22) {
      hecklersBase += 10;
      corporateBase -= 5;
      logs.push(`• High THC Potency (${activeStrain.thc}) supercharges rebel hecklers (+10.0%) but prompts corporate caution.`);
    }

    // 5. Composure Modifiers
    if (composure > 80) {
      hippiesBase += 4;
      corporateBase += 6;
      techBrosBase += 3;
      logs.push(`• High Stage Composure (${composure}%) adds stable-leadership charisma (+4.3% average).`);
    } else if (composure < 45) {
      corporateBase -= 12;
      hippiesBase -= 5;
      logs.push(`• Low Stage Composure (${composure}%) causes swing voters to worry about timeline stability (-12.0% Corporate).`);
    }

    // 6. Brutal Mode Factor
    if (isBrutalMode) {
      hecklersBase += 20;
      hippiesBase -= 8;
      corporateBase -= 15;
      logs.push("• 💀 BRUTAL MODE ACTIVE: Anti-establishment base fully galvanized (+20.0% Hecklers) but standard moderates panic.");
    }

    // Ensure ranges [0, 100]
    const nextDemographics = {
      hippies: Math.max(5, Math.min(99, Math.round(hippiesBase))),
      techBros: Math.max(5, Math.min(99, Math.round(techBrosBase))),
      corporate: Math.max(5, Math.min(99, Math.round(corporateBase))),
      hecklers: Math.max(5, Math.min(99, Math.round(hecklersBase)))
    };

    setDemographics(nextDemographics);

    // Calculate final weighted poll support
    // (Weighted by demographic voter share: Hippies 35%, Tech Bros 25%, Corporate 20%, Hecklers 20%)
    const puffWeighted = (
      (nextDemographics.hippies * 0.35) + 
      (nextDemographics.techBros * 0.25) + 
      (nextDemographics.corporate * 0.20) + 
      (nextDemographics.hecklers * 0.20)
    );

    const swingFactor = 100 - puffWeighted - (45 - (composure * 0.05));
    const nextSuperPuff = parseFloat(Math.max(25, Math.min(75, puffWeighted)).toFixed(1));
    const nextOpponent = parseFloat((100 - nextSuperPuff - Math.max(2, Math.min(15, swingFactor))).toFixed(1));
    
    setSuperPuffPoll(nextSuperPuff);
    setOpponentPoll(nextOpponent);
    setSwingVoters(parseFloat(Math.max(2, Math.min(25, swingFactor)).toFixed(1)));
    setApprovalRating(parseFloat(((nextSuperPuff / (nextSuperPuff + nextOpponent)) * 100).toFixed(1)));
    setHasPolled(true);
    setAuditLogs(logs.reverse());

    // Add timeline log event
    onLogEvent(
      'politician_event',
      '🗳️ Conducted District Polling',
      `Super Puff poll standing adjusted to ${nextSuperPuff}% vs Senator Hecklemore's ${nextOpponent}%. Swing voters: ${Math.max(2, Math.min(25, swingFactor)).toFixed(1)}%.`,
      nextSuperPuff > nextOpponent ? 'positive' : 'negative',
      {
        puffPoll: `${nextSuperPuff}%`,
        opponentPoll: `${nextOpponent}%`,
        district: 'District 9: Stand-up Valley',
        activeStrain: activeStrain.name
      }
    );

    // Reward some XP for doing the audit
    setComedyXp(prev => prev + 45);
  };

  // Handle Debate Selection
  const handleDebateSelection = (opt: any) => {
    // Sound FX
    playCrowdLaughterSfx();

    // Trigger timeline logging
    onLogEvent(
      'politician_event',
      opt.logHeadline,
      opt.logDetails,
      'positive',
      {
        question: debateQuestions[activeQuestionIdx].question,
        answer: opt.text,
        impactRating: `+${opt.effect.approval}% Approval`
      }
    );

    // Apply effects
    setDemographics(prev => ({
      hippies: Math.max(5, Math.min(99, prev.hippies + (opt.effect.hippies || 0))),
      techBros: Math.max(5, Math.min(99, prev.techBros + (opt.effect.techBros || 0))),
      corporate: Math.max(5, Math.min(99, prev.corporate + (opt.effect.corporate || 0))),
      hecklers: Math.max(5, Math.min(99, prev.hecklers + (opt.effect.hecklers || 0)))
    }));

    setApprovalRating(prev => parseFloat(Math.min(99.9, prev + opt.effect.approval).toFixed(1)));
    setCampaignFunds(prev => prev + opt.effect.funds);
    setComedyXp(prev => prev + 60);

    setCompletedDebates(prev => [...prev, activeQuestionIdx]);
    setDebateMessage(`Candidate response delivered! Campaign Funds +$${opt.effect.funds}, +60 XP, Approval Rating up.`);

    setTimeout(() => {
      setDebateMessage(null);
      // Advance to next or wrap
      if (activeQuestionIdx < debateQuestions.length - 1) {
        setActiveQuestionIdx(prev => prev + 1);
      } else {
        // Recycle
        setActiveQuestionIdx(0);
        setCompletedDebates([]);
      }
    }, 4500);
  };

  return (
    <div className="space-y-4 text-left font-mono">
      {/* Politician Mode Header Banner */}
      <div className="p-4 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-red-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
          <Vote className="w-20 h-20 text-blue-400" />
        </div>
        
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-lg">⚖️</span>
          <span className="text-xs font-black text-blue-300 uppercase tracking-widest">
            Campaign Headquarters
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[8px] font-bold text-blue-300 border border-blue-500/40 animate-pulse">
            POLITICIAN MODE: ACTIVE
          </span>
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-tight">
          Super Puff For Chronological Governor
        </h3>
        <p className="text-[10px] text-white/60 leading-relaxed font-light mt-1 max-w-sm">
          Fulfill logical policy platforms, handle debate inquiries from angry moderates, and calculate logical voter distributions across district polling zones.
        </p>
      </div>

      {/* Campaign Dashboard Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-1">
          <span className="text-[9px] text-white/40 uppercase">Approval Rating</span>
          <span className="text-lg font-black text-emerald-400">{approvalRating}%</span>
          <span className="text-[8px] text-white/30 truncate">District 9 Polled</span>
        </div>
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-1">
          <span className="text-[9px] text-white/40 uppercase">Campaign Funds</span>
          <span className="text-lg font-black text-amber-400">${campaignFunds}</span>
          <span className="text-[8px] text-white/30">From high-energy sets</span>
        </div>
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-1">
          <span className="text-[9px] text-white/40 uppercase">Swing Voter Share</span>
          <span className="text-lg font-black text-blue-400">{swingVoters}%</span>
          <span className="text-[8px] text-white/30">Undecided moderates</span>
        </div>
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-1">
          <span className="text-[9px] text-white/40 uppercase">Debate Adversary</span>
          <span className="text-[11px] font-black text-red-400 leading-tight truncate mt-1">Senator Hecklemore</span>
          <span className="text-[8px] text-white/30">Incumbent (60m Standard)</span>
        </div>
      </div>

      {/* Interactive Platform Builder (Logical Ballot Calculator) */}
      <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">
              Logical Policy Allocator
            </span>
          </div>
          <span className="text-[9px] font-mono text-white/40">Total Weight: 150 Points</span>
        </div>

        <div className="space-y-3">
          {/* Policy 1 */}
          <div>
            <div className="flex justify-between text-[10px] text-white/80 mb-1">
              <span>🌿 Cannabis Decriminalisation</span>
              <span className="text-emerald-400 font-bold">{policyDecrim}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={policyDecrim}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPolicyDecrim(val);
              }}
              className="w-full accent-emerald-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/40 mt-0.5">
              <span>Standard ban</span>
              <span>Unlimited standard vaporizers</span>
            </div>
          </div>

          {/* Policy 2 */}
          <div>
            <div className="flex justify-between text-[10px] text-white/80 mb-1">
              <span>⏰ 54-Minute Hour Standardization</span>
              <span className="text-blue-400 font-bold">{policyTime}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={policyTime}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPolicyTime(val);
              }}
              className="w-full accent-blue-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/40 mt-0.5">
              <span>Standard clock systems</span>
              <span>Quantum chronological speedup</span>
            </div>
          </div>

          {/* Policy 3 */}
          <div>
            <div className="flex justify-between text-[10px] text-white/80 mb-1">
              <span>🎙️ Heckler Defusal Enforcement</span>
              <span className="text-red-400 font-bold">{policySpeech}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={policySpeech}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPolicySpeech(val);
              }}
              className="w-full accent-red-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/40 mt-0.5">
              <span>Anarchic comedy cellar</span>
              <span>Total smoke-blast order</span>
            </div>
          </div>
        </div>

        {/* Campaign Focus Targeting Selector */}
        <div className="pt-2">
          <span className="text-[9px] text-white/40 uppercase block mb-1.5">Target District Demography</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'hippies', label: '🌿 Hippie Meadow', icon: '🌸' },
              { id: 'tech-bros', label: '💻 Tech Corridor', icon: '🚀' },
              { id: 'corporate', label: '💼 Bondholders', icon: '📈' },
              { id: 'hecklers', label: '🎙️ Cellar Rebels', icon: '🔥' }
            ].map((dem) => (
              <button
                key={dem.id}
                onClick={() => setTargetDemography(dem.id as any)}
                className={`p-1.5 rounded-lg border text-[9px] font-mono text-center flex items-center justify-center gap-1 transition-all ${
                  targetDemography === dem.id
                    ? 'border-blue-400 bg-blue-500/20 text-blue-200 font-bold'
                    : 'border-white/5 bg-black/20 text-white/50 hover:text-white/80'
                }`}
              >
                <span>{dem.icon}</span>
                <span>{dem.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conduct Logical Polling Button */}
        <button
          onClick={handleCalculatePolls}
          className="w-full py-2 px-4 rounded-xl border border-blue-500 text-blue-300 font-bold text-xs bg-blue-500/10 hover:bg-blue-500/25 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
        >
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          <span>🗳️ Vote Super Puff (Simulate Logically)</span>
        </button>
      </div>

      {/* Logical Polling Visualizer Chart */}
      {hasPolled && (
        <div className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/80 uppercase font-black">
              Simulated General Election Polling Chart
            </span>
            <span className="text-[8px] text-white/40 font-mono">Margin of error: ±1.5%</span>
          </div>

          {/* Interactive SVG / Tailwind Graph for Candidates */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-blue-300 flex items-center gap-1">🐉 Super Puff (Campaign)</span>
                <span className="text-blue-300">{superPuffPoll}%</span>
              </div>
              <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-1000 flex items-center justify-end pr-2"
                  style={{ width: `${superPuffPoll}%` }}
                >
                  <span className="text-[8px] text-white font-black">{superPuffPoll}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-red-400 flex items-center gap-1">🎙️ Senator Hecklemore (Incumbent)</span>
                <span className="text-red-400">{opponentPoll}%</span>
              </div>
              <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-1000 flex items-center justify-end pr-2"
                  style={{ width: `${opponentPoll}%` }}
                >
                  <span className="text-[8px] text-white font-black">{opponentPoll}%</span>
                </div>
              </div>
            </div>

            {/* Swing Voter Indicator */}
            <div className="flex justify-between items-center text-[9px] text-white/40 border-t border-white/5 pt-2">
              <span>Undecided Swing Voters:</span>
              <span className="font-bold text-white">{swingVoters}%</span>
            </div>
          </div>

          {/* Demographics Breakdown Matrix */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[9px] text-white/40 uppercase block mb-2">Platform Demographics Support Support</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/5">
                <span className="text-white/60">🌿 Traditional Hippies</span>
                <span className="font-bold text-emerald-400">{demographics.hippies}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/5">
                <span className="text-white/60">💻 Downtown Tech Bros</span>
                <span className="font-bold text-blue-400">{demographics.techBros}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/5">
                <span className="text-white/60">💼 Corporate Boardrooms</span>
                <span className="font-bold text-purple-400">{demographics.corporate}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/5">
                <span className="text-white/60">🔥 The Heckler Syndicate</span>
                <span className="font-bold text-red-400">{demographics.hecklers}%</span>
              </div>
            </div>
          </div>

          {/* Dynamic Logical Audit Log Console */}
          <div className="space-y-1">
            <span className="text-[9px] text-white/40 uppercase block">Logical Voter Impact Logs</span>
            <div className="p-2.5 rounded-xl border border-white/5 bg-black/80 max-h-24 overflow-y-auto text-[9px] font-mono text-white/50 space-y-1">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex gap-1">
                  <span className="text-blue-500">▶</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logical Debate Arena Portal */}
      <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">
              Chronological Debate Arena
            </span>
          </div>
          <span className="text-[9px] text-white/40">Question {activeQuestionIdx + 1} of 3</span>
        </div>

        {debateMessage ? (
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 text-center animate-pulse">
            🗳️ {debateMessage}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest block mb-1">
                SENATOR HECKLEMORE ASKS:
              </span>
              <p className="text-xs text-white/80 italic leading-relaxed">
                "{debateQuestions[activeQuestionIdx].question}"
              </p>
            </div>

            <div className="space-y-2">
              {debateQuestions[activeQuestionIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleDebateSelection(opt)}
                  className="w-full text-left p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/15 hover:border-purple-500/40 transition-all flex flex-col gap-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-purple-300 uppercase">
                      {opt.label}
                    </span>
                    <span className="text-[8px] text-purple-400 font-bold tracking-widest uppercase group-hover:text-purple-300">
                      SELECT RESPONSE
                    </span>
                  </div>
                  <p className="text-[10px] text-white/60 leading-relaxed font-light">
                    "{opt.text}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Humorous Scrolling Campaign News Ticker */}
      <div className="w-full border border-white/10 bg-black/60 rounded-xl overflow-hidden py-1.5">
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {newsTickerHeadlines.map((headline, i) => (
              <span key={i} className="text-[9px] font-mono text-blue-400/80 uppercase tracking-wider">
                ⭐️ {headline}
              </span>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8">
            {newsTickerHeadlines.map((headline, i) => (
              <span key={i} className="text-[9px] font-mono text-blue-400/80 uppercase tracking-wider">
                ⭐️ {headline}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
