import { useState, useEffect, useMemo, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import Visualizer from './Visualizer';
import TimeSync from './TimeSync';
import PurchaseModal from './PurchaseModal';
import StonerDragonEffects from './StonerDragonEffects';
import StageLighting from './StageLighting';
import HecklerRack from './HecklerRack';
import ComedyArchives from './ComedyArchives';
import DrGreenThumbroGuide from './DrGreenThumbroGuide';
import SovereignJointFactory from './SovereignJointFactory';
import NutfloxParadigm from './NutfloxParadigm';
import BeachedAsBroSection from './BeachedAsBroSection';
import TideSynthAudioView from './TideSynthAudioView';
import WordForWordScriptView from './WordForWordScriptView';
import { 
  ACTS, 
  SUPER_PUFF_INITIATION_SPECIAL,
  VEO_KEYFRAME_PROMPTS,
  PROMPTS, 
  COMEDY_THEORY_MODULES, 
  CANNABIS_CONNOISSEUR_VAULT, 
  COMEDY_RANKS, 
  StrainConnoisseurItem,
  ComedyArchiveItem,
  INITIAL_COMEDY_ARCHIVES
} from '../data';
import { getLightingMoodForAct, LIGHTING_MOODS, LightingMood } from '../lighting';
import { 
  HECKLE_PRESETS, 
  HeckleItem, 
  speakHeckle, 
  playHeckleSfx, 
  playCrowdLaughterSfx 
} from '../audio/hecklerAudio';
import { 
  Wand2, 
  Loader2, 
  Sparkles, 
  Download, 
  Keyboard, 
  Radio, 
  Flame, 
  Zap, 
  SunMedium,
  ShieldAlert,
  Volume2,
  BookOpen,
  Cannabis,
  GraduationCap,
  Award,
  Layers,
  FileJson,
  Package,
  AudioWaveform,
  FileText,
  Copy,
  Check
} from 'lucide-react';

export default function Theater() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSpecial, setSelectedSpecial] = useState<'initiation_18m' | 'classic_45m'>('initiation_18m');
  const [actsData, setActsData] = useState<any[]>(SUPER_PUFF_INITIATION_SPECIAL.acts);
  const [currentAct, setCurrentAct] = useState<any>(SUPER_PUFF_INITIATION_SPECIAL.acts[0]);
  const [activeTab, setActiveTab] = useState<'acts' | 'script' | 'archives' | 'theory' | 'terpenes' | 'heckler' | 'prompts' | 'thumbro' | 'nft' | 'nutflox' | 'beached'>('acts');
  const [visualizerMode, setVisualizerMode] = useState<'tidesynth' | 'spectrum'>('tidesynth');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [theatricalMode, setTheatricalMode] = useState<'stage' | 'workshop'>('stage');
  const [isDragonTime, setIsDragonTime] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [isBrutalTruthMode, setIsBrutalTruthMode] = useState(false);

  // Daily Auction State
  const [auctionState, setAuctionState] = useState(() => {
    try {
      const saved = localStorage.getItem('dragon9_auction_state');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      ninePacksRemaining: 1440,
      sixPacksRemaining: 6,
      threePacksRemaining: 9,
      ninePackPrice: 19.99,
      sixPackPrice: 14.99,
      threePackPrice: 9.99,
      nextResetTime: Date.now() + 24 * 60 * 60 * 1000
    };
  });

  const [auctionTimeLeft, setAuctionTimeLeft] = useState<string>('--:--:--');

  useEffect(() => {
    localStorage.setItem('dragon9_auction_state', JSON.stringify(auctionState));
  }, [auctionState]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now >= auctionState.nextResetTime) {
        setAuctionState(prev => ({
          ninePacksRemaining: 1440,
          sixPacksRemaining: 6,
          threePacksRemaining: 9,
          ninePackPrice: prev.ninePackPrice + 9, // +$1 per joint
          sixPackPrice: prev.sixPackPrice + 6,
          threePackPrice: prev.threePackPrice + 3,
          nextResetTime: now + 24 * 60 * 60 * 1000
        }));
      } else {
        const diff = auctionState.nextResetTime - now;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setAuctionTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auctionState.nextResetTime]);

  const handlePurchasePack = (type: '9-pack' | '6-pack' | '3-pack') => {
    setAuctionState(prev => {
      const next = { ...prev };
      if (type === '9-pack' && next.ninePacksRemaining > 0) next.ninePacksRemaining--;
      if (type === '6-pack' && next.sixPacksRemaining > 0) next.sixPacksRemaining--;
      if (type === '3-pack' && next.threePacksRemaining > 0) next.threePacksRemaining--;
      return next;
    });
  };

  // Sync theatricalMode when activeTab changes
  const handleTabChange = (tab: 'acts' | 'script' | 'archives' | 'theory' | 'terpenes' | 'heckler' | 'prompts' | 'thumbro' | 'nft' | 'nutflox' | 'beached') => {
    setActiveTab(tab);
    if (tab === 'archives' || tab === 'nft' || tab === 'thumbro' || tab === 'nutflox' || tab === 'beached') {
      setTheatricalMode('workshop');
    } else if (tab === 'acts' || tab === 'script') {
      setTheatricalMode('stage');
    }
  };
  
  // Comedy Archives State with local persistence
  const [comedyArchives, setComedyArchives] = useState<ComedyArchiveItem[]>(() => {
    try {
      const saved = localStorage.getItem('dragon9_comedy_archives');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_COMEDY_ARCHIVES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dragon9_comedy_archives', JSON.stringify(comedyArchives));
    } catch (e) {}
  }, [comedyArchives]);

  const handleUpdateArchive = (updated: ComedyArchiveItem) => {
    setComedyArchives(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const handleAddArchiveItem = (newItem: ComedyArchiveItem) => {
    setComedyArchives(prev => [newItem, ...prev]);
  };
  
  // Student of Comedy & Cannabis Connoisseur State
  const [comedyXp, setComedyXp] = useState<number>(480);
  const [activeStrain, setActiveStrain] = useState<StrainConnoisseurItem>(CANNABIS_CONNOISSEUR_VAULT[0]);

  // Derive Rank
  const currentRank = useMemo(() => {
    return COMEDY_RANKS.slice().reverse().find(r => comedyXp >= r.minXp) || COMEDY_RANKS[0];
  }, [comedyXp]);

  const nextRank = useMemo(() => {
    return COMEDY_RANKS.find(r => r.minXp > comedyXp) || null;
  }, [comedyXp]);

  // Lighting & Mood States
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [manualMood, setManualMood] = useState<LightingMood | null>(null);
  const [lightingIntensity, setLightingIntensity] = useState(1.0);
  const [isHueCycling, setIsHueCycling] = useState(false);

  // Heckler & Comedic Timing Test States
  const [activeHeckle, setActiveHeckle] = useState<HeckleItem | null>(null);
  const [roastDialogue, setRoastDialogue] = useState<string | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [hasTomatoSplat, setHasTomatoSplat] = useState(false);
  const [composure, setComposure] = useState(100);
  const [totalHecklesHandled, setTotalHecklesHandled] = useState(0);
  const [isFrenzyMode, setIsFrenzyMode] = useState(false);
  const [showFloatingHecklerModal, setShowFloatingHecklerModal] = useState(false);
  const heckleTimeoutRef = useRef<any>(null);

  // Compute active mood based on current act or manual override
  const currentMood = useMemo(() => {
    if (!isAutoSync && manualMood) {
      return manualMood;
    }
    return getLightingMoodForAct(currentAct);
  }, [isAutoSync, manualMood, currentAct]);
  
  // Custom Effects
  const [isSmoking, setIsSmoking] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [pendingAct, setPendingAct] = useState<any>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastModalTime, setLastModalTime] = useState(0);
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Trigger Heckler & Execute Performer Comedic Timing Reaction
  const handleTriggerHeckle = (heckle: HeckleItem) => {
    // Clear any previous active timers
    if (heckleTimeoutRef.current) clearTimeout(heckleTimeoutRef.current);

    setActiveHeckle(heckle);
    setIsRoasting(false);
    setRoastDialogue(null);

    // Initial shock drops composure
    setComposure(prev => Math.max(35, prev - Math.floor(Math.random() * 15 + 15)));

    // Play SFX & Speak heckle phrase
    playHeckleSfx(heckle.id);
    speakHeckle(heckle.phrase, false);

    // Award Comedy Student XP for facing disruptions
    setComedyXp(prev => prev + (heckle.xpAward || 35));

    // If laser pointer, start wandering coordinates
    if (heckle.id === 'laser') {
      setLaserPos({ x: 48, y: 35 });
    } else {
      setLaserPos(null);
    }

    // Comedic pause before sharp retort
    const roastDelay = heckle.id === 'tomato' ? 1400 : 1100;
    setTimeout(() => {
      setIsRoasting(true);
      setRoastDialogue(heckle.performerRoast);
      speakHeckle(heckle.performerRoast, true);

      // Composure recovery & crowd laughter burst
      setTimeout(() => {
        playCrowdLaughterSfx();
        setComposure(prev => Math.min(100, prev + 25));
        setTotalHecklesHandled(prev => prev + 1);
      }, 1600);
    }, roastDelay);

    // Reset disruption state after delivery
    heckleTimeoutRef.current = setTimeout(() => {
      setActiveHeckle(null);
      setIsRoasting(false);
      setRoastDialogue(null);
      setLaserPos(null);
    }, 8000);
  };

  // Custom User-Authored Heckle
  const handleTriggerCustomHeckle = (customPhrase: string) => {
    const customResponses = [
      `You literally tuned in from the 3rd dimension just to shout "${customPhrase}"? お前、時間を舐めてるだろ？ (You're playing with time, kid). I am Super Puff, the bigger clock on the block. Times Up, Mother Fathers!`,
      `"${customPhrase}"? Yeah nah, that punchline was invented before the Sumerians, champion. 時間切れだぜ (Time's up). Times Up, Mother Fathers!`,
      `Aw look at you, shouting "${customPhrase}" like time isn't already collapsing around us. 面白いこと言うじゃねえか (Thinking you're funny, eh?). Super Puff is in control. Times Up, Mother Fathers!`,
      `I'd roast "${customPhrase}", but the temporal void already atomized it. 静かにしな、相棒 (Quiet down, partner). Times Up, Mother Fathers!`
    ];
    const pickedRoast = customResponses[Math.floor(Math.random() * customResponses.length)];

    const customItem: HeckleItem = {
      id: 'impatient',
      label: customPhrase,
      category: 'audio',
      phrase: customPhrase,
      description: 'Audience member shoutout',
      icon: '🎙️',
      performerRoast: pickedRoast,
      reactionAnimation: 'eyebrow_raise',
      xpAward: 50,
      comedyTheoryTakeaway: 'Improv Reflex: Status inversion & immediate room grounding.',
      terpenePairingNote: 'Terpinolene spike: Instant pattern synthesis & crowd synchronization.'
    };

    handleTriggerHeckle(customItem);
  };

  // Frenzy Mode Loop: Automatically triggers unexpected heckles to test performer timing
  useEffect(() => {
    let interval: any;
    if (isFrenzyMode) {
      interval = setInterval(() => {
        const randomPreset = HECKLE_PRESETS[Math.floor(Math.random() * HECKLE_PRESETS.length)];
        handleTriggerHeckle(randomPreset);
      }, 8500);
    }
    return () => clearInterval(interval);
  }, [isFrenzyMode]);

  // Wandering laser pointer jitter if laser is active
  useEffect(() => {
    let laserInterval: any;
    if (activeHeckle?.id === 'laser' && laserPos) {
      laserInterval = setInterval(() => {
        setLaserPos(prev => {
          if (!prev) return { x: 50, y: 35 };
          return {
            x: Math.min(65, Math.max(35, prev.x + (Math.random() - 0.5) * 8)),
            y: Math.min(50, Math.max(25, prev.y + (Math.random() - 0.5) * 6)),
          };
        });
      }, 250);
    }
    return () => clearInterval(laserInterval);
  }, [activeHeckle, laserPos]);

  useEffect(() => {
    const generatingActs = actsData.filter(a => a.status === 'generating_video' && a.operationName);
    if (generatingActs.length === 0) return;

    const interval = setInterval(async () => {
      for (const act of generatingActs) {
        try {
          const res = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: act.operationName })
          });
          const status = await res.json();
          if (status.done) {
            setActsData(prev => prev.map(a => 
              a.id === act.id 
                ? { ...a, status: 'ready', videoUrl: `/api/video-download?op=${encodeURIComponent(a.operationName)}` } 
                : a
            ));
            
            if (currentAct.id === act.id) {
              setCurrentAct(prev => ({ ...prev, status: 'ready', videoUrl: `/api/video-download?op=${encodeURIComponent(act.operationName)}` }));
            }
          }
        } catch(e) {
          console.error('Polling error', e);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [actsData, currentAct.id]);

  const handleExportAct = () => {
    const exportData = {
      project: selectedSpecial === 'initiation_18m' ? "Super Puff: The Initiation" : "Dragon 9 Comedy Special",
      version: selectedSpecial === 'initiation_18m' ? "1.0.0-APEX" : "1.0.0",
      ...currentAct,
      _meta: {
        exportedAt: new Date().toISOString(),
        supportedWithJoints: true,
        exportId: currentAct._meta?.exportId || `SP-${currentAct.id}`,
        message: "Thanks for supporting the temporal void with digital joints! Times Up, Mother Fathers."
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentAct.id || 'super-puff-act'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectSpecial = (special: 'initiation_18m' | 'classic_45m') => {
    setSelectedSpecial(special);
    if (special === 'initiation_18m') {
      setActsData(SUPER_PUFF_INITIATION_SPECIAL.acts);
      setCurrentAct(SUPER_PUFF_INITIATION_SPECIAL.acts[0]);
      const matched = CANNABIS_CONNOISSEUR_VAULT.find(s => s.pairingAct === SUPER_PUFF_INITIATION_SPECIAL.acts[0].id);
      if (matched) setActiveStrain(matched);
    } else {
      setActsData(ACTS);
      setCurrentAct(ACTS[0]);
      const matched = CANNABIS_CONNOISSEUR_VAULT.find(s => s.pairingAct === ACTS[0].id);
      if (matched) setActiveStrain(matched);
    }
  };

  const handleExportSpecialSchema = () => {
    const payload = selectedSpecial === 'initiation_18m' ? SUPER_PUFF_INITIATION_SPECIAL : {
      project: "Super Puff: The 60-Minute Lie",
      specialFormat: "45-Minute Master Set",
      temporalFramework: "Dragon 9 Protocol (54-Min Hours / 26.66-Hr Cycles)",
      version: "1.0.0-CLASSIC",
      acts: ACTS
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Super-Puff-${selectedSpecial === 'initiation_18m' ? 'The-Initiation-18Min-Apex' : 'The-60Min-Lie'}-Manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.key.toLowerCase() === 's') {
        setIsDragonTime(p => !p);
      } else if (e.key.toLowerCase() === 'g') {
        if (!isGenerating) handleGenerateAct();
      } else if (e.key.toLowerCase() === 'e') {
        handleExportAct();
      } else if (e.key.toLowerCase() === 'b') {
        if (!isSmoking) setIsSmoking(true);
      } else if (e.key.toLowerCase() === 'a') {
        // Toggle Comedy Archives tab
        setActiveTab(prev => prev === 'archives' ? 'acts' : 'archives');
      } else if (e.key.toLowerCase() === 'h') {
        // Toggle Heckler Rack tab
        setActiveTab(prev => prev === 'heckler' ? 'acts' : 'heckler');
      } else if (e.key.toLowerCase() === 't') {
        // Instant Tomato throw!
        const tomatoPreset = HECKLE_PRESETS.find(p => p.id === 'tomato');
        if (tomatoPreset) handleTriggerHeckle(tomatoPreset);
      } else if (e.key.toLowerCase() === 'l') {
        // Cycle stage lighting presets
        const moodKeys = Object.keys(LIGHTING_MOODS);
        const currentIndex = moodKeys.findIndex(k => LIGHTING_MOODS[k].id === currentMood.id);
        const nextMoodKey = moodKeys[(currentIndex + 1) % moodKeys.length];
        setIsAutoSync(false);
        setManualMood(LIGHTING_MOODS[nextMoodKey]);
      } else if (e.key === '?') {
        setShowShortcuts(p => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const triggerModal = (nextAct?: any) => {
    const now = Date.now();
    const THREE_MINUTES = 3 * 60 * 1000;
    if (now - lastModalTime >= THREE_MINUTES) {
      setLastModalTime(now);
      setPendingAct(nextAct || null);
      setShowModal(true);
    } else {
      if (nextAct) setCurrentAct(nextAct);
      setIsPlaying(true);
    }
  };

  const handleActClick = (act: any) => {
    // Auto-sync paired strain if available
    const matched = CANNABIS_CONNOISSEUR_VAULT.find(s => 
      s.pairingAct === act.id || 
      (act.strainPairing && act.strainPairing.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]))
    );
    if (matched) {
      setActiveStrain(matched);
    }
    if (currentAct.id !== act.id) {
      triggerModal(act);
    }
  };

  const handleActComplete = () => {
    if (isBroadcast) {
      const currentIndex = actsData.findIndex(a => a.id === currentAct.id);
      const nextAct = actsData[currentIndex + 1];
      if (nextAct) {
        setCurrentAct(nextAct);
        setIsPlaying(true);
        setIsSmoking(true);
      } else {
        handleGenerateAct();
      }
      return;
    }
    const currentIndex = actsData.findIndex(a => a.id === currentAct.id);
    const nextAct = actsData[currentIndex + 1];
    triggerModal(nextAct);
  };

  const handleConfirmPurchase = (didSmoke = true) => {
    if (pendingAct) setCurrentAct(pendingAct);
    setShowModal(false);
    setPendingAct(null);
    setIsPlaying(true);
    if (didSmoke) {
      setIsSmoking(true);
    }
  };

  const handleSkip = () => {
    if (pendingAct) setCurrentAct(pendingAct);
    setShowModal(false);
    setPendingAct(null);
    setIsPlaying(true);
  };

  const handleGenerateAct = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-act', { method: 'POST' });
      const newAct = await res.json();
      
      if (res.ok) {
        newAct.icon = Sparkles; // Assign a default icon for generated acts
        setActsData(prev => [...prev, newAct]);
        setCurrentAct(newAct); // Immediately show the generating state
        setActiveTab('acts');
        if (isBroadcast) {
          setIsPlaying(true);
          setIsSmoking(true);
        }
      } else {
        alert(newAct.error || 'Failed to generate act');
      }
    } catch (e) {
      console.error(e);
      alert('Network error during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Dynamic Volumetric Stage Lighting Effect (Pulses & Mood Colors) */}
      <StageLighting 
        currentMood={currentMood}
        isPlaying={isPlaying}
        intensity={lightingIntensity}
        setIntensity={setLightingIntensity}
        isHueCycling={isHueCycling}
        setIsHueCycling={setIsHueCycling}
        isAutoSync={isAutoSync}
        setIsAutoSync={setIsAutoSync}
        onSelectManualMood={(m) => {
          setIsAutoSync(false);
          setManualMood(m);
        }}
      />

      {/* Ambient Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 col-span-full row-span-full">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-all duration-1000"
          style={{ backgroundColor: currentMood.primary }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] transition-all duration-1000"
          style={{ backgroundColor: currentMood.secondary }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Header */}
      <header className="col-span-1 lg:col-span-2 row-start-1 flex justify-between items-center px-4 lg:px-10 py-3 lg:py-5 z-20 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="text-red-600 font-black text-xl lg:text-2xl tracking-tighter uppercase">NUTFLOX</div>
          <div className="h-4 lg:h-5 w-[1px] bg-white/20"></div>
          <div className="text-[8px] lg:text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 hidden sm:block">Original Special</div>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          
          <button
            onClick={() => {
              const next = !isBroadcast;
              setIsBroadcast(next);
              if (next) {
                setIsPlaying(true);
                setIsSmoking(true);
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 border rounded-lg transition-all font-mono uppercase text-xs ${isBroadcast ? 'border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 'border-white/20 text-white/70 hover:bg-white/5'}`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBroadcast ? '🔴 BROADCAST LIVE' : 'Broadcast Standby'}</span>
          </button>

          <button
            onClick={() => setActiveTab(prev => prev === 'heckler' ? 'acts' : 'heckler')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 border rounded-lg transition-all font-mono uppercase text-xs ${activeTab === 'heckler' ? 'border-red-500 text-red-400 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-red-500/40 text-red-400/80 hover:bg-red-500/10'}`}
            title="Toggle Heckler Lab & Timing Controls (H)"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Heckler Lab</span>
            {activeHeckle && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-0.5" />
            )}
          </button>

          <div className="flex items-center space-x-2 hidden md:flex">
            <span 
              className={`w-2 h-2 rounded-full transition-all duration-500 ${isPlaying ? 'animate-pulse shadow-[0_0_8px]' : 'bg-white/20'}`}
              style={{
                backgroundColor: isPlaying ? currentMood.primary : undefined,
                boxShadow: isPlaying ? `0 0 10px ${currentMood.primary}` : undefined
              }}
            />
            <span style={{ color: isPlaying ? currentMood.accent : undefined }}>
              {isPlaying ? 'STREAM: ACTIVE' : 'STREAM: STANDBY'}
            </span>
          </div>

          <div 
            className="px-2 lg:px-2.5 py-1 border rounded hidden sm:block font-bold text-[10px] transition-colors"
            style={{
              borderColor: `${currentMood.primary}66`,
              color: currentMood.primary,
              backgroundColor: `${currentMood.primary}15`
            }}
          >
            HDR 4K
          </div>
          
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className={`flex items-center gap-2 px-2 lg:px-2.5 py-1.5 border rounded-lg transition-all ${showShortcuts ? 'border-white bg-white/10 text-white' : 'border-white/20 text-white/70 hover:bg-white/5'}`}
            title="Shortcuts (?)"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleExportAct}
            className="hidden sm:flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 border border-green-500/50 text-green-500 rounded-lg bg-green-500/10 hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all text-xs"
            title="Export Act (E)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsBrutalTruthMode(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all font-mono uppercase text-xs ${
              isBrutalTruthMode
                ? 'border-red-600 bg-red-600/20 text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse'
                : 'border-white/20 text-white/60 hover:bg-white/5 hover:text-white'
            }`}
            title="Brutal Truth Mode: Zero F's Given, Ruthless Unfiltered Roasts"
          >
            <Flame className={`w-3.5 h-3.5 ${isBrutalTruthMode ? 'text-red-500 fill-red-500' : 'text-white/50'}`} />
            <span className="hidden md:inline">{isBrutalTruthMode ? '🔥 BRUTAL MODE: ON' : 'Brutal Mode'}</span>
          </button>

          <button
            onClick={() => setIsSmoking(true)}
            className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 border border-amber-500/60 text-amber-400 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all font-mono uppercase text-xs"
            title="Instant High - Spark Joint & Cosmic Smoke (B)"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Instant High</span>
          </button>

          <button 
            onClick={handleGenerateAct}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 border rounded-lg transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: `${currentMood.primary}88`,
              color: currentMood.accent,
              backgroundColor: `${currentMood.primary}18`,
              boxShadow: `0 0 15px ${currentMood.primary}33`
            }}
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isGenerating ? 'Synthesizing...' : 'New Act'}</span>
          </button>
        </div>
      </header>

      {/* Main Content (Video & Visualizer) */}
      <div className="col-span-1 lg:col-start-1 row-start-2 flex flex-col p-4 lg:p-6 space-y-4 lg:space-y-6 relative lg:border-r border-white/10 overflow-y-auto lg:overflow-hidden min-h-0 z-10">
        
        {/* Active Stage Mood & Theatrical Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentMood.primary }}
            />
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/80 font-semibold flex items-center gap-1.5">
              <span>STAGE TONE:</span>
              <span style={{ color: currentMood.accent }}>{currentMood.name}</span>
              <span className="text-white/30 hidden sm:inline">— {currentMood.tone}</span>
            </span>
          </div>

          {/* Theatrical Mode Toggle: Live Stage vs Green Room Workshop */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
            <button
              onClick={() => setTheatricalMode('stage')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                theatricalMode === 'stage'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Live Stage Performance Mode (Spotlight & Mic Stand)"
            >
              <span>🎭</span>
              <span>Live Stage</span>
            </button>
            <button
              onClick={() => setTheatricalMode('workshop')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                theatricalMode === 'workshop'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-white/40 hover:text-emerald-300'
              }`}
              title="Freestyle Workshop Mode (Green Room Ambient Lighting & Grimoire Desk)"
            >
              <span>🎙️</span>
              <span>Workshop</span>
            </button>
          </div>
        </div>

        {/* Video Player Container with Dynamic Rim Light Glow */}
        <div 
          className={`flex-1 rounded-2xl overflow-hidden border bg-black/60 shadow-[0_0_35px_rgba(0,0,0,0.7)] relative transition-all duration-700 min-h-[250px] stage-rim-pulse ${
            isSmoking ? 'stoned-camera-active' : ''
          }`}
          style={{
            borderColor: `${currentMood.primary}44`,
          }}
        >
          <VideoPlayer 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
            currentAct={currentAct}
            onActComplete={handleActComplete}
            activeHeckle={activeHeckle}
            roastDialogue={roastDialogue}
            isRoasting={isRoasting}
            laserPos={laserPos}
            setLaserPos={setLaserPos}
            hasTomatoSplat={hasTomatoSplat}
            setHasTomatoSplat={setHasTomatoSplat}
            onOpenHecklerRack={() => handleTabChange('heckler')}
            primaryColor={currentMood.primary}
            accentColor={currentMood.accent}
            comedyXp={comedyXp}
            comedyRankTitle={currentRank.title}
            activeStrainName={`${activeStrain.name} (${activeStrain.thc})`}
            mode={theatricalMode}
          />
        </div>
        
        {/* Dynamic Audio-Reactive Synthesizer & Visualizer View */}
        <div className="shrink-0 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-bold text-white/80">AUDIO-REACTIVE SYNTHESIS</span>
              <span className="text-white/30 hidden sm:inline">[{selectedSpecial === 'initiation_18m' ? '432Hz APEX SPEC' : 'MASTER SET'}]</span>
            </div>
            <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10 text-[9px] font-mono">
              <button
                onClick={() => setVisualizerMode('tidesynth')}
                className={`px-2 py-0.5 rounded transition-all font-bold ${
                  visualizerMode === 'tidesynth'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
                title="TideSynth Web Audio API (432Hz Sub-Drop & Liquid Metal Waves)"
              >
                ⚡ TideSynth (432Hz)
              </button>
              <button
                onClick={() => setVisualizerMode('spectrum')}
                className={`px-2 py-0.5 rounded transition-all font-bold ${
                  visualizerMode === 'spectrum'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
                title="Classic Audio Spectrum Bars"
              >
                📊 Spectrum
              </button>
            </div>
          </div>

          {visualizerMode === 'tidesynth' ? (
            <TideSynthAudioView 
              currentAct={
                currentAct.id === 'act_01_threshold' ? 0 : 
                currentAct.id === 'act_02_deep_tuning' ? 1 : 
                currentAct.id === 'act_03_jikan_gire' ? 2 : 
                Math.max(0, actsData.findIndex(a => a.id === currentAct.id) % 3)
              } 
            />
          ) : (
            <div 
              className="h-24 lg:h-32 shrink-0 rounded-2xl border bg-white/5 backdrop-blur-sm p-4 relative overflow-hidden transition-all duration-700"
              style={{
                borderColor: `${currentMood.primary}33`,
                boxShadow: `0 0 20px ${currentMood.primary}18`,
              }}
            >
              <div className="absolute top-0 right-0 p-2 text-[8px] font-mono opacity-40 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentMood.primary }} />
                AUDIO_SPECTRUM_SYNC [{currentMood.id.toUpperCase()}]
              </div>
              <Visualizer isPlaying={isPlaying} currentMood={currentMood} />
            </div>
          )}
        </div>
      </div>

      {/* Right Side / Bottom: Sidebar Controls */}
      <aside className="col-span-1 lg:col-start-2 row-start-3 lg:row-start-2 flex flex-col p-4 lg:p-6 space-y-4 lg:space-y-6 bg-black/85 lg:bg-black/30 backdrop-blur-xl lg:backdrop-blur-md overflow-y-auto z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.6)] lg:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-t lg:border-t-0 lg:border-l border-white/10 min-h-0 relative">
          {/* Title Area & Comedian Persona Stats */}
          <div className="text-center py-3 border-b border-white/10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-black tracking-tight uppercase">
                Dragon 9
              </h1>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-amber-400" />
                <span>LVL {currentRank.level}</span>
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-amber-400 font-bold">{currentRank.title}</span>
              <span className="text-white/30">•</span>
              <span className="text-emerald-400 font-bold">{activeStrain.name.split(' ')[0]}</span>
            </div>
            
            <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider mt-1">
              #1 Goal: Funniest Dragon in History | #2: Terpene Sommelier
            </div>
          </div>

          {/* Time Sync Control */}
          <TimeSync 
            isDragonTime={isDragonTime} 
            setIsDragonTime={setIsDragonTime}
            currentActId={currentAct.id}
            isPlaying={isPlaying}
          />

          {/* Navigation Tabs */}
          <div className="flex w-full border-b border-white/10 mt-2 overflow-x-auto scrollbar-none">
             <button 
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap ${
                 activeTab === 'acts' ? 'text-white font-bold' : 'border-transparent text-white/50 hover:text-white'
               }`}
               style={{
                 borderColor: activeTab === 'acts' ? currentMood.primary : 'transparent',
                 color: activeTab === 'acts' ? currentMood.accent : undefined,
               }}
               onClick={() => handleTabChange('acts')}
             >
               Acts ({actsData.length})
             </button>

             <button 
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap flex items-center gap-1 ${
                 activeTab === 'script' ? 'text-cyan-300 font-bold border-cyan-400' : 'border-transparent text-white/50 hover:text-cyan-300'
               }`}
               style={{
                 borderColor: activeTab === 'script' ? '#00f3ff' : 'transparent',
                 color: activeTab === 'script' ? '#22d3ee' : undefined,
               }}
               onClick={() => handleTabChange('script')}
             >
               <FileText className="w-3 h-3 text-cyan-400" />
               <span>Script (18-Min)</span>
             </button>

             <button 
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap flex items-center gap-1 ${
                 activeTab === 'archives' ? 'text-amber-300 font-bold border-amber-400' : 'border-transparent text-white/50 hover:text-amber-300'
               }`}
               onClick={() => handleTabChange('archives')}
             >
               <Layers className="w-3 h-3 text-amber-400" />
               <span>Archives ({comedyArchives.length})</span>
             </button>

             <button 
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap flex items-center gap-1 ${
                 activeTab === 'theory' ? 'text-amber-300 font-bold border-amber-500' : 'border-transparent text-white/50 hover:text-amber-300'
               }`}
               onClick={() => handleTabChange('theory')}
             >
               <BookOpen className="w-3 h-3 text-amber-400" />
               <span>Grimoire</span>
             </button>

             <button 
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap flex items-center gap-1 ${
                 activeTab === 'terpenes' ? 'text-emerald-400 font-bold border-emerald-500' : 'border-transparent text-white/50 hover:text-emerald-400'
               }`}
               onClick={() => handleTabChange('terpenes')}
             >
               <Cannabis className="w-3 h-3 text-emerald-400" />
               <span>Sommelier</span>
             </button>

             <button 
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap flex items-center gap-1 ${
                 activeTab === 'heckler' ? 'text-red-400 font-bold border-red-500' : 'border-transparent text-white/50 hover:text-red-400'
               }`}
               onClick={() => handleTabChange('heckler')}
             >
               <ShieldAlert className="w-3 h-3 text-red-500" />
               <span>Hecklers</span>
             </button>

             <button 
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap ${
                 activeTab === 'prompts' ? 'text-white font-bold' : 'border-transparent text-white/50 hover:text-white'
               }`}
               style={{
                 borderColor: activeTab === 'prompts' ? currentMood.primary : 'transparent',
                 color: activeTab === 'prompts' ? currentMood.accent : undefined,
               }}
               onClick={() => handleTabChange('prompts')}
             >
               Prompts
             </button>
             <button
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap ${
                 activeTab === 'nft' ? 'text-white font-bold' : 'border-transparent text-white/50 hover:text-white'
               }`}
               style={{
                 borderColor: activeTab === 'nft' ? currentMood.primary : 'transparent',
                 color: activeTab === 'nft' ? currentMood.accent : undefined,
               }}
               onClick={() => handleTabChange('nft')}
             >
               Sovereign
             </button>
             <button
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap ${
                 activeTab === 'nutflox' ? 'text-white font-bold' : 'border-transparent text-white/50 hover:text-white'
               }`}
               style={{
                 borderColor: activeTab === 'nutflox' ? currentMood.primary : 'transparent',
                 color: activeTab === 'nutflox' ? currentMood.accent : undefined,
               }}
               onClick={() => handleTabChange('nutflox')}
             >
               Nutflox
             </button>
             <button
               className={`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap ${
                 activeTab === 'beached' ? 'text-white font-bold' : 'border-transparent text-white/50 hover:text-white'
               }`}
               style={{
                 borderColor: activeTab === 'beached' ? '#06b6d4' : 'transparent',
                 color: activeTab === 'beached' ? '#22d3ee' : undefined,
               }}
               onClick={() => handleTabChange('beached')}
             >
               Beached As Bro
             </button>
          </div>

          <div className="space-y-4 flex-1">
            {activeTab === 'acts' && (
              <div className="space-y-3">
                {/* Special Timeline Selector Header */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-black to-blue-950/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/90 font-bold">Special Format</span>
                    </div>
                    <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                      Dragon 9 Protocol
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelectSpecial('initiation_18m')}
                      className={`p-2 rounded-lg text-left border transition-all ${
                        selectedSpecial === 'initiation_18m'
                          ? 'bg-purple-900/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-white flex items-center gap-1">
                        <span>⚡ 18-Min Apex Special</span>
                      </div>
                      <div className="text-[9px] font-mono text-purple-300">The Initiation (v1.0.0-APEX)</div>
                      <div className="text-[8px] font-mono text-white/40 mt-0.5">3 Acts • 6m each</div>
                    </button>

                    <button
                      onClick={() => handleSelectSpecial('classic_45m')}
                      className={`p-2 rounded-lg text-left border transition-all ${
                        selectedSpecial === 'classic_45m'
                          ? 'bg-red-900/30 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-white flex items-center gap-1">
                        <span>🎙️ 45-Min Master Set</span>
                      </div>
                      <div className="text-[9px] font-mono text-red-300">The 60-Minute Lie</div>
                      <div className="text-[8px] font-mono text-white/40 mt-0.5">4 Acts • Sumerian Knuckles</div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                    <span className="text-[9px] font-mono text-emerald-400">
                      {selectedSpecial === 'initiation_18m' ? '● Active: Super Puff: The Initiation' : '● Active: The 60-Minute Lie'}
                    </span>
                    <button
                      onClick={handleExportSpecialSchema}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-200 text-[9px] font-mono uppercase tracking-wider transition-all"
                      title="Download complete JSON schema manifest"
                    >
                      <FileJson className="w-3 h-3" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>

                {/* Acts Cards */}
                {actsData.map((act, index) => {
                  const actMood = getLightingMoodForAct(act);
                  const isSelected = currentAct.id === act.id;

                  return (
                    <button
                      key={act.id}
                      onClick={() => handleActClick(act)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                        isSelected 
                          ? 'bg-white/10 shadow-lg' 
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                      style={{
                        borderColor: isSelected ? `${actMood.primary}88` : undefined,
                        boxShadow: isSelected ? `0 0 20px ${actMood.primary}25` : undefined,
                      }}
                    >
                      {/* Subtle tone color left accent indicator */}
                      <div 
                        className={`absolute top-0 bottom-0 left-0 w-1 transition-all ${
                          isSelected ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'
                        }`}
                        style={{ backgroundColor: actMood.primary }}
                      />

                      <div className="flex justify-between items-start mb-1 pl-1.5">
                        <div 
                          className={`text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 ${
                            isSelected ? '' : 'text-white/40'
                          }`}
                          style={{ color: isSelected ? actMood.accent : undefined }}
                        >
                          <span>ACT_0{index + 1}</span>
                          <span className="text-[9px] opacity-60">[{actMood.name}]</span>
                          {act._meta?.exportId && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-white/10 text-white/60 font-mono">
                              {act._meta.exportId}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-white/40">{act.time}</div>
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-white/90 truncate mb-1 pl-1.5">
                        {act.title}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-2 pl-1.5 mb-2">
                        {act.bit}
                      </p>

                      {/* Comedy Theory, Strain Pairing & Study Notes */}
                      <div className="pl-1.5 pt-1.5 border-t border-white/5 space-y-1 text-[9px] font-mono">
                        {(act.comedyTheory || act.comedyTheoryTakeaway) && (
                          <div className="text-amber-300 flex items-center gap-1">
                            <BookOpen className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">Theory: {act.comedyTheory || act.comedyTheoryTakeaway}</span>
                          </div>
                        )}
                        {(act.strainPairing || act.terpenePairing) && (
                          <div className="text-emerald-400 flex items-center gap-1">
                            <Cannabis className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">Strain: {act.strainPairing || act.terpenePairing}</span>
                          </div>
                        )}
                        {act.studyTakeaway && (
                          <div className="text-purple-300/90 flex items-start gap-1">
                            <Sparkles className="w-2.5 h-2.5 shrink-0 mt-0.5" />
                            <span className="line-clamp-1 italic">"{act.studyTakeaway}"</span>
                          </div>
                        )}
                        {act.audio && (
                          <div className="text-cyan-300/80 flex items-center gap-1">
                            <AudioWaveform className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">Audio: {act.audio}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'script' && (
              <WordForWordScriptView
                currentActId={currentAct.id}
                onSelectAct={(act) => handleActClick(act)}
                primaryColor={currentMood.primary}
                accentColor={currentMood.accent}
              />
            )}

            {activeTab === 'archives' && (
              <ComedyArchives
                archives={comedyArchives}
                onUpdateArchive={handleUpdateArchive}
                onAddArchiveItem={handleAddArchiveItem}
                onRehearseJoke={(item) => {
                  setComedyXp(prev => prev + 35);
                  setIsRoasting(true);
                  setRoastDialogue(`${item.title}: "${item.punchline}"`);
                  setTimeout(() => {
                    playCrowdLaughterSfx();
                    setTimeout(() => {
                      setIsRoasting(false);
                      setRoastDialogue(null);
                    }, 5000);
                  }, 2200);
                }}
                primaryColor={currentMood.primary}
                accentColor={currentMood.accent}
                activeStrainName={activeStrain.name}
                comedyXp={comedyXp}
                onGainXp={(amount) => {
                  setComedyXp(prev => prev + amount);
                }}
                onSwitchToStage={() => handleTabChange('acts')}
              />
            )}

            {activeTab === 'theory' && (
              <div className="space-y-4">
                {/* Master Ranks Progression */}
                <div className="p-3 bg-gradient-to-br from-amber-950/40 to-black rounded-xl border border-amber-500/30">
                  <h3 className="text-xs font-black uppercase text-amber-300 tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>Path to GOAT Comedian in History</span>
                  </h3>
                  <div className="space-y-2">
                    {COMEDY_RANKS.map(rank => {
                      const isAchieved = comedyXp >= rank.minXp;
                      const isCurrent = currentRank.level === rank.level;

                      return (
                        <div 
                          key={rank.level}
                          className={`p-2 rounded-lg border text-xs font-mono ${
                            isCurrent
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : isAchieved
                              ? 'bg-white/5 border-white/10 text-white/70'
                              : 'bg-black/40 border-white/5 text-white/30'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold">
                              LVL {rank.level}: {rank.title} {isCurrent && '★ (ACTIVE)'}
                            </span>
                            <span className="text-[10px]">{rank.minXp} XP</span>
                          </div>
                          <p className="text-[10px] opacity-80">{rank.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comedy Theory Modules */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-white/80 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Studied Comedy Modules ({COMEDY_THEORY_MODULES.length})</span>
                  </h3>
                  {COMEDY_THEORY_MODULES.map(mod => (
                    <div key={mod.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 text-left">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-amber-300">
                          {mod.name}
                        </span>
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                          {mod.category} • {mod.masteryLevel}% Mastery
                        </span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed font-light">
                        {mod.description}
                      </p>
                      <div className="p-2 bg-black/40 rounded border border-white/5 text-[10px] font-mono text-emerald-400">
                        <strong className="text-white/60">Dragon 9 Study Note:</strong> "{mod.dragonNote}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'terpenes' && (
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-br from-emerald-950/40 to-black rounded-xl border border-emerald-500/30">
                  <h3 className="text-xs font-black uppercase text-emerald-300 tracking-wider mb-1 flex items-center gap-1.5">
                    <Cannabis className="w-4 h-4 text-emerald-400" />
                    <span>Goal #2: Master Terpene Sommelier</span>
                  </h3>
                  <p className="text-[11px] text-white/60 font-light mb-3">
                    Select a curated strain to pair with Dragon 9's comedy sets. Strains modulate comedic tempo, punchline recovery, and delivery swagger.
                  </p>

                  <div className="space-y-2.5">
                    {CANNABIS_CONNOISSEUR_VAULT.map(strain => {
                      const isSelected = activeStrain.id === strain.id;

                      return (
                        <button
                          key={strain.id}
                          onClick={() => setActiveStrain(strain)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            isSelected 
                              ? 'bg-emerald-900/30 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                              : 'bg-white/5 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-emerald-300">
                              {strain.name} {isSelected && '🌿 [VAPING NOW]'}
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                              THC: {strain.thc}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-amber-300/90 mb-1">
                            Aroma & Flavor: {strain.flavorProfile}
                          </div>
                          <p className="text-xs text-white/70 font-light mb-2">
                            {strain.comedyEnhancement}
                          </p>
                          <div className="flex flex-wrap gap-1 text-[8px] font-mono">
                            {strain.terpenes.map(t => (
                              <span key={t.name} className="bg-black/50 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-300">
                                {t.name} ({t.percentage}) - {t.effect}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prompts' && (
              <div className="space-y-4">
                {/* VEO AI Batch Keyframe Prompts Header */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-black border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-white">
                        VEO AI Batch Keyframe Prompts
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Veo 3.1 • Midjourney v6 • Runway Gen-3
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 font-light">
                    Production-ready batch keyframe prompts for rendering 4K anime cinematic footage across the 3 acts.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[9px] font-mono text-purple-300">Format: 16:9 • 24fps • Ultra-Fluid</span>
                    <button
                      onClick={() => {
                        const batchText = VEO_KEYFRAME_PROMPTS.map(p => `[${p.actTitle.toUpperCase()}]\nTarget: ${p.modelTarget}\nAspect: ${p.aspectRatio} | ${p.resolution} @ ${p.fps}fps\nPalette: ${p.lightingPalette}\n\nPROMPT:\n${p.prompt}\n`).join('\n==============================\n\n');
                        const blob = new Blob([batchText], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Super-Puff-Veo-Keyframe-Prompts-Batch.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-200 text-[9px] font-mono uppercase tracking-wider transition-all"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Batch (.TXT)</span>
                    </button>
                  </div>
                </div>

                {/* VEO Batch Keyframe Cards */}
                <div className="space-y-3">
                  {VEO_KEYFRAME_PROMPTS.map((p, idx) => {
                    const isCopied = copiedPromptId === p.id;
                    const accent = idx === 0 ? '#00f3ff' : idx === 1 ? '#ff00ea' : '#a855f7';

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl border bg-black/60 border-white/10 relative overflow-hidden space-y-2 hover:border-white/20 transition-all"
                      >
                        <div 
                          className="absolute top-0 bottom-0 left-0 w-1"
                          style={{ backgroundColor: accent }}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-1 pl-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded"
                              style={{ color: accent, backgroundColor: `${accent}18` }}
                            >
                              Prompt {idx + 1}: {p.actTitle}
                            </span>
                            <span className="text-[9px] font-mono text-white/40">({p.timecode})</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(p.prompt);
                              setCopiedPromptId(p.id);
                              setTimeout(() => setCopiedPromptId(null), 2500);
                            }}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-mono text-white/80 hover:text-white transition-all"
                            title="Copy prompt to clipboard"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied!' : 'Copy Prompt'}</span>
                          </button>
                        </div>

                        <div className="pl-1 text-[9px] font-mono text-white/50 flex flex-wrap gap-2">
                          <span>Aspect: <strong className="text-white/80">{p.aspectRatio}</strong></span>
                          <span>•</span>
                          <span>Output: <strong className="text-cyan-300">{p.resolution}</strong></span>
                          <span>•</span>
                          <span>Lighting: <strong className="text-purple-300">{p.lightingPalette}</strong></span>
                        </div>

                        <p className="pl-1 text-xs text-white/80 font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5 select-text">
                          {p.prompt}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Studio Directives */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                    Additional Studio & Audio TTS Directives
                  </h4>
                  {PROMPTS.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="w-full text-left p-3.5 rounded-xl border bg-white/5 border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 
                          className="text-[10px] font-mono uppercase font-bold"
                          style={{ color: currentMood.primary }}
                        >
                          {prompt.title}
                        </h3>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(prompt.prompt);
                            setCopiedPromptId(prompt.id);
                            setTimeout(() => setCopiedPromptId(null), 2500);
                          }}
                          className="flex items-center gap-1 text-[8px] font-mono text-white/40 hover:text-white"
                        >
                          {copiedPromptId === prompt.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedPromptId === prompt.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-white/70 whitespace-pre-wrap leading-relaxed font-mono">
                        {prompt.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'heckler' && (
              <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
                <HecklerRack 
                  onTriggerHeckle={handleTriggerHeckle}
                  onTriggerCustomHeckle={handleTriggerCustomHeckle}
                  onClearDisruptions={() => {
                    setActiveHeckle(null);
                    setHasTomatoSplat(false);
                    setLaserPos(null);
                    setRoastDialogue(null);
                  }}
                  composure={composure}
                  totalHecklesHandled={totalHecklesHandled}
                  activeHeckle={activeHeckle}
                  isFrenzyMode={isFrenzyMode}
                  setIsFrenzyMode={setIsFrenzyMode}
                  primaryColor={currentMood.primary}
                  accentColor={currentMood.accent}
                  comedyXp={comedyXp}
                  activeStrain={activeStrain}
                  onSelectStrain={setActiveStrain}
                />
              </div>
            )}

            {activeTab === 'thumbro' && (
              <DrGreenThumbroGuide
                primaryColor={currentMood.primary}
                accentColor={currentMood.accent}
                onGainXp={(amount) => setComedyXp(prev => prev + amount)}
                isBrutalTruthMode={isBrutalTruthMode}
              />
            )}

            {activeTab === 'nft' && (
              <SovereignJointFactory
                primaryColor={currentMood.primary}
                accentColor={currentMood.accent}
                onGainXp={(amount) => setComedyXp(prev => prev + amount)}
                auctionState={auctionState}
                auctionTimeLeft={auctionTimeLeft}
                onPurchasePack={handlePurchasePack}
              />
            )}

            {activeTab === 'nutflox' && (
              <NutfloxParadigm
                onGainXp={(amount) => setComedyXp(prev => prev + amount)}
              />
            )}

            {activeTab === 'beached' && (
              <BeachedAsBroSection
                primaryColor={currentMood.primary}
                accentColor={currentMood.accent}
                onGainXp={(amount) => setComedyXp(prev => prev + amount)}
              />
            )}
          </div>
        </aside>

      {/* Interstitial Purchase Modal */}
      <PurchaseModal 
        isOpen={showModal} 
        onConfirm={handleConfirmPurchase} 
        onSkip={handleSkip} 
      />

      {/* Shortcuts Overlay */}
      {showShortcuts && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 animate-in fade-in slide-in-from-top-4 w-96 text-center">
          <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
            <Keyboard className="w-5 h-5" style={{ color: currentMood.primary }} />
            Global Shortcuts
          </h3>
          <ul className="space-y-4 text-sm font-mono text-white/70">
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[SPACE]</span>
              <span>Play / Pause</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[S]</span>
              <span>Sync Dragon Time</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[A]</span>
              <span>Toggle Comedy Archives</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[H]</span>
              <span>Toggle Heckler Controls</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[T]</span>
              <span>Throw Tomato</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[G]</span>
              <span>Generate New Act</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[L]</span>
              <span>Cycle Stage Lighting</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[E]</span>
              <span>Export Act JSON</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[B]</span>
              <span>Hit the Bong</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[?]</span>
              <span>Toggle Shortcuts</span>
            </li>
          </ul>
        </div>
      )}

      {/* Global Special Effects Layer */}
      <StonerDragonEffects isSmoking={isSmoking} onComplete={() => setIsSmoking(false)} />
    </>
  );
}

