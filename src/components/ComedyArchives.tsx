import React, { useState, useMemo } from 'react';
import { 
  ComedyArchiveItem, 
  StrainConnoisseurItem, 
  CANNABIS_CONNOISSEUR_VAULT 
} from '../data';
import { 
  speakHeckle, 
  playMasteryChimeSfx, 
  playCrowdLaughterSfx 
} from '../audio/hecklerAudio';
import ZenBonsaiOrigamiSanctuary from './ZenBonsaiOrigamiSanctuary';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Search, 
  SlidersHorizontal, 
  Volume2, 
  Cannabis, 
  MessageSquare, 
  Send, 
  Plus, 
  RotateCcw, 
  Mic2, 
  Clock, 
  Zap, 
  Compass, 
  Check, 
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Edit3,
  Lightbulb,
  ThumbsUp,
  TrendingUp,
  Flower2,
  Scissors,
  Maximize2
} from 'lucide-react';

interface ComedyArchivesProps {
  archives: ComedyArchiveItem[];
  onUpdateArchive: (item: ComedyArchiveItem) => void;
  onAddArchiveItem: (item: ComedyArchiveItem) => void;
  onRehearseJoke?: (item: ComedyArchiveItem) => void;
  primaryColor?: string;
  accentColor?: string;
  activeStrainName?: string;
  comedyXp?: number;
  onGainXp?: (amount: number) => void;
  onSwitchToStage?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'dragon';
  text: string;
  timestamp: string;
  suggestedAction?: {
    title: string;
    premise: string;
    punchline: string;
    technique: string;
    masteryStatus: 'mastered' | 'needs_practice';
  };
}

export default function ComedyArchives({
  archives,
  onUpdateArchive,
  onAddArchiveItem,
  onRehearseJoke,
  primaryColor = '#ea580c',
  accentColor = '#f59e0b',
  activeStrainName = 'Cosmic OG (31.4% THC)',
  comedyXp = 480,
  onGainXp,
  onSwitchToStage,
}: ComedyArchivesProps) {
  // Navigation View: 'directory' | 'freestyle' | 'zen'
  const [viewMode, setViewMode] = useState<'directory' | 'freestyle' | 'zen'>('directory');
  const [isZenOverlayOpen, setIsZenOverlayOpen] = useState(false);
  const [isZenSidebarOpen, setIsZenSidebarOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'needs_practice'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'bits' | 'timing' | 'crowd_work' | 'philosophy' | 'heckler_roasts' | 'props'>('all');

  // Expanded Cards Map
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'arch-1': true,
  });

  // Note editing state: [itemId]: boolean
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  // New Joke Modal State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'bits' | 'timing' | 'crowd_work' | 'philosophy' | 'heckler_roasts' | 'props'>('bits');
  const [newPremise, setNewPremise] = useState('');
  const [newPunchline, setNewPunchline] = useState('');
  const [newTechnique, setNewTechnique] = useState('');
  const [newStrain, setNewStrain] = useState(CANNABIS_CONNOISSEUR_VAULT[0].name);
  const [newDeliveryCue, setNewDeliveryCue] = useState('');
  const [newInitialStatus, setNewInitialStatus] = useState<'mastered' | 'needs_practice'>('needs_practice');

  // Freestyle Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'dragon',
      text: 'Gidday legend! Welcome to the green room comedy workshop. I\'m currently studying status inversions while enjoying a slow puff. What joke premise, timing rhythm, or crowd work roast are we workshopping today, eh?',
      timestamp: 'Green Room Live',
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isDragonTyping, setIsDragonTyping] = useState(false);
  const [autoSpeakDragon, setAutoSpeakDragon] = useState(true);

  // Statistics calculation
  const totalItems = archives.length;
  const masteredCount = archives.filter(a => a.masteryStatus === 'mastered').length;
  const needsPracticeCount = archives.filter(a => a.masteryStatus === 'needs_practice').length;
  const masteryPercentage = totalItems > 0 ? Math.round((masteredCount / totalItems) * 100) : 0;

  // Filtered list
  const filteredArchives = useMemo(() => {
    return archives.filter(item => {
      // Status filter
      if (statusFilter !== 'all' && item.masteryStatus !== statusFilter) return false;
      
      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesPremise = item.premise.toLowerCase().includes(q);
        const matchesPunchline = item.punchline.toLowerCase().includes(q);
        const matchesTech = item.craftTechnique.toLowerCase().includes(q);
        const matchesNotes = item.practiceNotes?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesPremise && !matchesPunchline && !matchesTech && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [archives, statusFilter, categoryFilter, searchQuery]);

  // Toggle Mastery Status
  const handleToggleMastery = (item: ComedyArchiveItem) => {
    const nextStatus = item.masteryStatus === 'mastered' ? 'needs_practice' : 'mastered';
    const updated: ComedyArchiveItem = {
      ...item,
      masteryStatus: nextStatus,
      lastWorkshopped: 'Archives Workshop',
    };

    onUpdateArchive(updated);

    if (nextStatus === 'mastered') {
      playMasteryChimeSfx('mastered');
      if (onGainXp) onGainXp(item.xpValue || 50);
    } else {
      playMasteryChimeSfx('practice');
    }
  };

  // Toggle Card Accordion
  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Rehearse a Joke live
  const handleRehearse = (item: ComedyArchiveItem) => {
    playMasteryChimeSfx('punchline');
    
    // Dragon speaks punchline
    const speechText = item.punchline.replace(/"/g, '').replace(/\*/g, '');
    speakHeckle(speechText, true);

    // Increment rehearsal count & award XP
    const updated: ComedyArchiveItem = {
      ...item,
      rehearsalCount: item.rehearsalCount + 1,
      lastWorkshopped: 'Rehearsal Stage',
    };
    onUpdateArchive(updated);
    if (onGainXp) onGainXp(20);

    if (onRehearseJoke) onRehearseJoke(item);

    // Delayed crowd chuckle
    setTimeout(() => {
      playCrowdLaughterSfx();
    }, 1400);
  };

  // Save Note edit
  const handleSaveNote = (item: ComedyArchiveItem) => {
    const updated: ComedyArchiveItem = {
      ...item,
      practiceNotes: noteDraft,
      lastWorkshopped: 'Note Revision',
    };
    onUpdateArchive(updated);
    setEditingNoteId(null);
    setNoteDraft('');
  };

  // Send Joke to Freestyle Conversation
  const handleSendToFreestyle = (item: ComedyArchiveItem) => {
    setViewMode('freestyle');
    const userPrompt = `Hey Dragon 9, let's workshop "${item.title}". The premise is: "${item.premise}". How can I sharpen the timing and elevate this to 100% mastery?`;
    
    setChatMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: userPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    setIsDragonTyping(true);
    setTimeout(() => {
      const dragonReply = `Aw mate, "${item.title}" is a classic ${item.craftTechnique} piece! Here's the comedy physics: You're currently using ${item.recommendedStrain} to keep your heart rate grounded. When you deliver: "${item.punchline}", remember the rule of the pregnant pause—hold dead silence for 1.4 seconds right before the reveal! If you add a subtle Kiwi self-deprecating tag at the end, the room will explode. What do you think of tagging it with: "Just a bit unideal, eh?"`;

      setChatMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'dragon',
          text: dragonReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: {
            title: item.title,
            premise: item.premise,
            punchline: item.punchline,
            technique: item.craftTechnique,
            masteryStatus: item.masteryStatus,
          }
        }
      ]);
      setIsDragonTyping(false);
      if (autoSpeakDragon) {
        speakHeckle(dragonReply, true);
      }
    }, 900);
  };

  // Submit Freestyle Chat message
  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isDragonTyping) return;

    const userText = chatInput.trim();
    setChatInput('');

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, newMsg]);
    setIsDragonTyping(true);

    // Procedural In-Character AI Stand-Up Coach Dialogue
    setTimeout(() => {
      let reply = '';
      let actionObj: ChatMessage['suggestedAction'] | undefined = undefined;

      const lower = userText.toLowerCase();

      if (lower.includes('origami') || lower.includes('bonsai') || lower.includes('折り紙') || lower.includes('盆栽') || lower.includes('japanese') || lower.includes('nihongo') || lower.includes('hai') || lower.includes('super puff')) {
        reply = `はい、その通りだぜ！ (Hai, exactly right!). Origami and Bonsai are the ultimate secrets of Super Puff's comedy geometry! 
        
Bonsai (盆栽) teaches you to prune deadwood and useless filler words with surgical shears until only the pure, muscular punchline remains. 
Origami (折り紙) teaches you how to take a 4-dimensional crisis, make three crisp washi paper creases, and fold it into an elegant flying crane.

When you merge Japanese precision with dry Kiwi timing: "盆栽を見ろ、無駄な枝を切れ！ (Look at the bonsai, prune the useless branches!)" — you become the bigger clock on the block. Times Up, Mother Fathers!`;
        actionObj = {
          title: 'The Zen Bonsai & Origami Crane Routine (折り紙・盆栽の極意)',
          premise: 'Super Puff shows how comedy writing is identical to pruning bonsai branches and folding washi paper cranes.',
          punchline: '"You lot write a 3-page setup for a dad joke. 盆栽を見ろ (Look at the bonsai)! I fold dimensional spacetime into a crane and hand you an existential punchline. Times Up, Mother Fathers!"',
          technique: 'Zen Botanical Geometry & Surgical Word-Pruning (折り紙・盆栽笑学)',
          masteryStatus: 'mastered',
        };
      } else if (lower.includes('clock') || lower.includes('54') || lower.includes('time') || lower.includes('sumerian')) {
        reply = `Right on! The temporal time distortion premise is sacred geometry. When you attack the 60-minute grid, don't rush the setup. Say: "5,000 years of knuckle counting..." then take a slow blunt pull. The crowd needs that 1.2s silence to realize their entire calendar is arbitrary. I'd rate this concept: Mastered in theory, just keep the vocal fry low.`;
        actionObj = {
          title: 'The 54-Minute Temporal Clock Trap',
          premise: 'Deconstructing arbitrary 60-minute linear grids using Sumerian knuckles.',
          punchline: '"Why are you rushing for a fictional 9 AM meeting when time is just an agreed-upon hallucination? Have a puff, legend."',
          technique: 'Temporal Deconstruction & Status Inversion',
          masteryStatus: 'mastered',
        };
      } else if (lower.includes('heckler') || lower.includes('roast') || lower.includes('phone') || lower.includes('shout')) {
        reply = `Polite Kiwi Disarmament 101, mate! If someone interrupts or looks at their phone, never scream at them. Smile warmly, lower your pitch into 40Hz, and say: "Aw bless ya legend, checking your crypto portfolio in the dark? Don't worry, it's still down in this dimension too." Disarm them with hospitality, then atomize them with geometry!`;
        actionObj = {
          title: 'Green Room Phone Screen Banter',
          premise: 'Calling out bright smartphone faces in a pitch-black comedy room.',
          punchline: '"Checking your crypto in row 2? Don’t worry, it’s still plummeting across all 40 parallel timelines. Rest easy."',
          technique: 'Disarming Polite Roasting',
          masteryStatus: 'mastered',
        };
      } else if (lower.includes('strain') || lower.includes('terpene') || lower.includes('weed') || lower.includes('smoke')) {
        reply = `Elite sommelier question! For deadpan, slow-burn rants, you want Cosmic OG with 2.8% Myrcene—it drops your vocal cords right into the pocket. For electric crowd roasts and dodging tomatoes, switch to Quantum Diesel with 2.1% Terpinolene. Keeps your brain 4 steps ahead of the front row!`;
      } else if (lower.includes('practice') || lower.includes('fix') || lower.includes('punchline') || lower.includes('three') || lower.includes('rule')) {
        reply = `Let's break down the rule of threes: Beat 1 is mundane (Birth). Beat 2 is relatable (Paying taxes). Beat 3 MUST be a total multiversal cliff-drop: "Sleeping on a gold hoard for 4,000 years and ignoring your dentist's voicemail." Mark this concept as 'Needs Practice' until you nail the 1.5s pause before the gold hoard!`;
        actionObj = {
          title: 'Subverted Rule of Threes (Mortgage vs Gold Hoard)',
          premise: 'Comparing standard life milestones with draconic slumber cycles.',
          punchline: '"Birth, taxes, then 4,000 years of sleeping on gold until your bank sends a strongly worded raven."',
          technique: 'Subverted Rule of Threes',
          masteryStatus: 'needs_practice',
        };
      } else {
        reply = `Yeah nah mate, brilliant thought! Every great bit starts as an unhinged premise in the green room. The secret to multiverse GOAT comedy is pairing that concept with absolute deadpan confidence and an unflinching pause. If you believe the joke is profound, the room will find it hilarious. Shall we log this in your Comedy Archives?`;
        actionObj = {
          title: `Freestyle: ${userText.slice(0, 30)}...`,
          premise: userText,
          punchline: '"And that, my friends, is why we don\'t trust linear calendars after 10 PM. Yeah nah, she\'ll be right."',
          technique: 'Improv Reflex & Cadence Calibration',
          masteryStatus: 'needs_practice',
        };
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'dragon',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: actionObj,
        }
      ]);
      setIsDragonTyping(false);
      if (onGainXp) onGainXp(30);

      if (autoSpeakDragon) {
        speakHeckle(reply, true);
      }
    }, 1000);
  };

  // Add workshopped joke from chat directly to archives
  const handleAddFromChat = (action: NonNullable<ChatMessage['suggestedAction']>) => {
    const newItem: ComedyArchiveItem = {
      id: `arch-custom-${Date.now()}`,
      title: action.title,
      category: 'bits',
      categoryLabel: 'Workshopped Bit',
      premise: action.premise,
      punchline: action.punchline,
      craftTechnique: action.technique,
      dragonReflection: 'Workshopped live in the Freestyle Green Room dialogue.',
      recommendedStrain: activeStrainName,
      deliveryCue: 'Take a calm breath, establish eye contact, deliver with dry Kiwi cadence.',
      masteryStatus: action.masteryStatus,
      practiceNotes: `Created via Freestyle Conversation on ${new Date().toLocaleDateString()}.`,
      rehearsalCount: 1,
      lastWorkshopped: 'Freestyle Workshop',
      funninessScore: 88,
      xpValue: 75,
    };

    onAddArchiveItem(newItem);
    playMasteryChimeSfx(action.masteryStatus === 'mastered' ? 'mastered' : 'practice');
    if (onGainXp) onGainXp(50);
  };

  // Handle Form Submit for Manual Add
  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPremise.trim() || !newPunchline.trim()) return;

    const newItem: ComedyArchiveItem = {
      id: `arch-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: newCategory === 'bits' ? 'Stand-Up Bit' : newCategory === 'timing' ? 'Timing & Delivery' : newCategory === 'crowd_work' ? 'Crowd Work & Banter' : newCategory === 'philosophy' ? 'Philosophical Premise' : newCategory === 'heckler_roasts' ? 'Heckler Counter-Attack' : 'Physical & Voice FX',
      premise: newPremise.trim(),
      punchline: newPunchline.trim(),
      craftTechnique: newTechnique.trim() || 'Custom Craft Mechanism',
      dragonReflection: 'Authored in the Dragon 9 Comedy Archives.',
      recommendedStrain: newStrain,
      deliveryCue: newDeliveryCue.trim() || 'Deliver with deadpan timing and relaxed posture.',
      masteryStatus: newInitialStatus,
      practiceNotes: 'Newly drafted bit. Ready for stage testing.',
      rehearsalCount: 0,
      lastWorkshopped: 'Writers Desk',
      funninessScore: 85,
      xpValue: 70,
    };

    onAddArchiveItem(newItem);
    playMasteryChimeSfx(newInitialStatus === 'mastered' ? 'mastered' : 'practice');
    if (onGainXp) onGainXp(60);

    // Reset Form
    setIsAddingNew(false);
    setNewTitle('');
    setNewPremise('');
    setNewPunchline('');
    setNewTechnique('');
    setNewDeliveryCue('');
  };

  return (
    <div className="w-full flex flex-col space-y-4 text-white">
      {/* Header Banner & Navigation Tabs */}
      <div className="bg-gradient-to-r from-amber-950/50 via-black/80 to-stone-950/60 p-4 rounded-2xl border border-amber-500/30 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider font-mono text-amber-300">
                Comedy Archives & Joke Grimoire
              </h2>
            </div>
            <p className="text-xs text-white/60 font-light mt-0.5">
              Dragon 9's master vault of learned bits, pause geometry, and crowd roasts.
            </p>
          </div>

          {/* Mode Switcher: Directory vs Freestyle vs Zen Sanctuary */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setViewMode('directory')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'directory'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vault ({totalItems})</span>
            </button>
            <button
              onClick={() => setViewMode('freestyle')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'freestyle'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-white/50 hover:text-emerald-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Workshop</span>
            </button>
            <button
              onClick={() => setViewMode('zen')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'zen'
                  ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-200 border border-emerald-400/50 shadow-sm'
                  : 'text-white/50 hover:text-emerald-300'
              }`}
            >
              <Flower2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zen Sanctuary (盆栽・折り紙)</span>
            </button>

            {/* Quick Calm-Down Overlay Trigger */}
            <button
              onClick={() => setIsZenOverlayOpen(true)}
              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[10px] flex items-center gap-1 ml-auto sm:ml-1"
              title="Open Full-Screen Zen Calm-Down Zone"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden md:inline">Zen Overlay</span>
            </button>
          </div>
        </div>

        {/* Progress & Mastery Gauge HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-center">
            <span className="text-[9px] uppercase tracking-wider text-white/40 block">Learned Concepts</span>
            <span className="text-base font-black text-white">{totalItems}</span>
          </div>

          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-center">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 block flex items-center justify-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Mastered
            </span>
            <span className="text-base font-black text-emerald-300">{masteredCount}</span>
          </div>

          <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-center">
            <span className="text-[9px] uppercase tracking-wider text-amber-400 block flex items-center justify-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" /> Needs Practice
            </span>
            <span className="text-base font-black text-amber-300">{needsPracticeCount}</span>
          </div>

          <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-center">
            <span className="text-[9px] uppercase tracking-wider text-white/40 block">Mastery Ratio</span>
            <span className="text-base font-black text-yellow-400">{masteryPercentage}%</span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-black/40 h-2 rounded-full mt-2.5 overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-yellow-300 rounded-full transition-all duration-700"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* ================= DIRECTORY VIEW ================= */}
      {viewMode === 'directory' && (
        <div className="space-y-4">
          {/* Controls: Search, Filters & Add New Button */}
          <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learned jokes, premises, punchlines, or techniques..."
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 font-mono"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-[10px] font-mono uppercase">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-white/20 border-white text-white font-bold'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                All ({archives.length})
              </button>

              <button
                onClick={() => setStatusFilter('mastered')}
                className={`px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap flex items-center gap-1 ${
                  statusFilter === 'mastered'
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400/70 hover:text-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Mastered ({masteredCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter('needs_practice')}
                className={`px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap flex items-center gap-1 ${
                  statusFilter === 'needs_practice'
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400/70 hover:text-amber-300'
                }`}
              >
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Needs Practice ({needsPracticeCount})</span>
              </button>

              <button
                onClick={() => setIsZenSidebarOpen(prev => !prev)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all text-[10px] font-mono flex items-center gap-1.5 ${
                  isZenSidebarOpen 
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 font-bold' 
                    : 'bg-white/5 border-white/10 text-emerald-400/80 hover:text-emerald-300'
                }`}
                title="Toggle Zen Bonsai & Origami Side Panel"
              >
                <span>🎋</span>
                <span className="hidden sm:inline">Zen Sanctuary Panel</span>
              </button>

              <button
                onClick={() => setIsAddingNew(true)}
                className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold transition-all whitespace-nowrap flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Bit</span>
              </button>
            </div>
          </div>

          {/* Optional Docked Zen Bonsai & Origami Sanctuary Panel */}
          {isZenSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <ZenBonsaiOrigamiSanctuary 
                isOpen={true} 
                onClose={() => setIsZenSidebarOpen(false)} 
                onGainXp={onGainXp}
              />
            </div>
          )}

          {/* Category Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[9px] font-mono uppercase scrollbar-none">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'bits', label: '🎙️ Stand-Up Bits' },
              { id: 'timing', label: '⏱️ Timing & Pauses' },
              { id: 'crowd_work', label: '👥 Crowd Work' },
              { id: 'philosophy', label: '🌌 Philosophical' },
              { id: 'heckler_roasts', label: '🛡️ Heckler Roasts' },
              { id: 'props', label: '💨 Physical & FX' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-2 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Manual Add New Joke Modal / Drawer */}
          {isAddingNew && (
            <form onSubmit={handleManualAddSubmit} className="p-4 bg-black/80 rounded-2xl border border-amber-500/40 space-y-3 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold font-mono uppercase text-amber-300">Draft New Comedic Concept</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <label className="text-[9px] uppercase text-white/40 block mb-1">Joke Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. The Quantum Lighter Paradox"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase text-white/40 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="bits">Stand-Up Bit</option>
                    <option value="timing">Timing & Delivery</option>
                    <option value="crowd_work">Crowd Work & Banter</option>
                    <option value="philosophy">Philosophical Premise</option>
                    <option value="heckler_roasts">Heckler Counter-Attack</option>
                    <option value="props">Physical & FX</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-mono">
                <label className="text-[9px] uppercase text-white/40 block mb-1">Setup / Premise</label>
                <textarea
                  rows={2}
                  required
                  value={newPremise}
                  onChange={(e) => setNewPremise(e.target.value)}
                  placeholder="Describe the initial observation or logical pattern setup..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="text-xs font-mono">
                <label className="text-[9px] uppercase text-white/40 block mb-1">Punchline / Climax</label>
                <textarea
                  rows={2}
                  required
                  value={newPunchline}
                  onChange={(e) => setNewPunchline(e.target.value)}
                  placeholder='The shattering punchline or callback statement (e.g. "Cheers for that, Gilgamesh")...'
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div>
                  <label className="text-[9px] uppercase text-white/40 block mb-1">Craft Technique</label>
                  <input
                    type="text"
                    value={newTechnique}
                    onChange={(e) => setNewTechnique(e.target.value)}
                    placeholder="e.g. Rule of Threes Subversion"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase text-white/40 block mb-1">Terpene / Strain Synergy</label>
                  <select
                    value={newStrain}
                    onChange={(e) => setNewStrain(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {CANNABIS_CONNOISSEUR_VAULT.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase text-white/40 block mb-1">Initial Mastery Status</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setNewInitialStatus('needs_practice')}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold ${
                        newInitialStatus === 'needs_practice'
                          ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      Needs Practice
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewInitialStatus('mastered')}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold ${
                        newInitialStatus === 'mastered'
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      Mastered
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Archive (+60 XP)</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Archive Items */}
          {filteredArchives.length === 0 ? (
            <div className="p-8 text-center bg-black/40 rounded-2xl border border-white/10 font-mono text-xs text-white/40 space-y-2">
              <Search className="w-6 h-6 mx-auto text-white/20 mb-1" />
              <p>No comedic concepts match your search filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}
                className="text-amber-400 underline hover:text-amber-300"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArchives.map(item => {
                const isExpanded = !!expandedCards[item.id];
                const isMastered = item.masteryStatus === 'mastered';

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isMastered
                        ? 'bg-gradient-to-br from-emerald-950/30 via-black/70 to-black/90 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                        : 'bg-gradient-to-br from-amber-950/30 via-black/70 to-black/90 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
                    }`}
                  >
                    {/* Main Card Header */}
                    <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {/* Status Icon Pill */}
                        <div className="mt-0.5 shrink-0">
                          {isMastered ? (
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                              <Award className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                              <Flame className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-bold font-mono uppercase text-white truncate">
                              {item.title}
                            </h3>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/60 border border-white/10 uppercase">
                              {item.categoryLabel}
                            </span>
                            <span className="text-[9px] font-mono text-amber-400 font-bold">
                              +{item.xpValue} XP
                            </span>
                          </div>

                          <p className="text-xs text-white/70 line-clamp-1 mt-0.5 font-light">
                            {item.premise}
                          </p>
                        </div>
                      </div>

                      {/* Right Controls: Mastery Toggle & Accordion Button */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {/* TOGGLE MASTERY BUTTON */}
                        <button
                          onClick={() => handleToggleMastery(item)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-black uppercase transition-all flex items-center gap-1.5 ${
                            isMastered
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                              : 'bg-amber-500/20 border-amber-400 text-amber-300 hover:bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          }`}
                          title={`Click to mark as ${isMastered ? 'Needs Practice' : 'Mastered'}`}
                        >
                          {isMastered ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Mastered</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                              <span>Needs Practice</span>
                            </>
                          )}
                        </button>

                        {/* Rehearse Audio Trigger */}
                        <button
                          onClick={() => handleRehearse(item)}
                          className="p-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
                          title="Rehearse punchline with Dragon 9 audio (+20 XP)"
                        >
                          <Volume2 className="w-4 h-4 text-amber-300" />
                        </button>

                        {/* Expand / Collapse Button */}
                        <button
                          onClick={() => toggleCard(item.id)}
                          className="p-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Accordion Body */}
                    {isExpanded && (
                      <div className="px-3 sm:px-4 pb-4 pt-2 border-t border-white/10 space-y-3 text-xs font-mono">
                        {/* Setup and Punchline Callout Box */}
                        <div className="p-3 bg-black/60 rounded-xl border border-white/10 space-y-2">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-white/40 block font-bold">
                              Setup / Premise:
                            </span>
                            <p className="text-xs text-white/90 font-light mt-0.5 leading-relaxed">
                              {item.premise}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/10">
                            <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-yellow-400" /> Punchline / Climax Landing:
                            </span>
                            <p className="text-xs sm:text-sm text-amber-200 font-medium italic mt-1 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                              {item.punchline}
                            </p>
                          </div>
                        </div>

                        {/* Theory Mechanics & Terpenes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {/* Craft Technique */}
                          <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 space-y-1">
                            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[10px]">
                              <BookOpen className="w-3 h-3 text-amber-400" />
                              <span>Mechanics: {item.craftTechnique}</span>
                            </div>
                            <p className="text-[11px] text-white/70 font-light leading-relaxed">
                              {item.dragonReflection}
                            </p>
                          </div>

                          {/* Strain Synergy & Delivery Cue */}
                          <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[10px]">
                              <Cannabis className="w-3 h-3 text-emerald-400" />
                              <span>Terpene Synergy: {item.recommendedStrain}</span>
                            </div>
                            <p className="text-[11px] text-white/70 font-light leading-relaxed">
                              <strong className="text-white/40">Delivery Cue:</strong> {item.deliveryCue}
                            </p>
                          </div>
                        </div>

                        {/* Practice Notes & Workshop Log */}
                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase text-white/40 font-bold flex items-center gap-1">
                              <Edit3 className="w-3 h-3" /> Practice Notes & Rehearsal Log ({item.rehearsalCount} runs):
                            </span>
                            {editingNoteId !== item.id && (
                              <button
                                onClick={() => {
                                  setEditingNoteId(item.id);
                                  setNoteDraft(item.practiceNotes || '');
                                }}
                                className="text-[9px] text-amber-400 hover:text-amber-300 underline"
                              >
                                Edit Notes
                              </button>
                            )}
                          </div>

                          {editingNoteId === item.id ? (
                            <div className="space-y-1.5">
                              <textarea
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                rows={2}
                                className="w-full bg-black/80 border border-amber-400/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  className="px-2 py-1 rounded border border-white/10 text-[9px] text-white/60"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNote(item)}
                                  className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[9px]"
                                >
                                  Save Notes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-white/60 font-light italic">
                              "{item.practiceNotes || 'No custom workshop notes recorded yet.'}"
                            </p>
                          )}
                        </div>

                        {/* Card Action Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2 text-[9px] text-white/40">
                            <span>Last Workshopped: <strong className="text-white/70">{item.lastWorkshopped}</strong></span>
                            <span>•</span>
                            <span>Funniness Score: <strong className="text-amber-400">{item.funninessScore}/100</strong></span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Send to Freestyle Conversation */}
                            <button
                              onClick={() => handleSendToFreestyle(item)}
                              className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Workshop in Freestyle</span>
                            </button>

                            {/* Rehearse Button */}
                            <button
                              onClick={() => handleRehearse(item)}
                              className="px-3 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                            >
                              <Mic2 className="w-3 h-3" />
                              <span>Rehearse Voice (+20 XP)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= FREESTYLE CONVERSATION VIEW ================= */}
      {viewMode === 'freestyle' && (
        <div className="space-y-4">
          {/* Workshop Top Banner */}
          <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-black to-black rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
                🎙️
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-mono uppercase text-emerald-300">
                  Dragon 9's Freestyle Comedy Workshop
                </h3>
                <p className="text-[10px] text-white/50">
                  Pitch jokes, test pauses, and talk comedy physics with Dragon 9 in a freestyle dialogue.
                </p>
              </div>
            </div>

            {/* Voice Readout Toggle & Return to Stage */}
            <div className="flex items-center gap-2 self-end sm:self-center text-[10px] font-mono">
              {onSwitchToStage && (
                <button
                  onClick={onSwitchToStage}
                  className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold transition-all flex items-center gap-1.5"
                  title="Switch Dragon to Live Stage Spotlight Mode"
                >
                  <span>🎭</span>
                  <span>Live Stage</span>
                </button>
              )}
              <button
                onClick={() => setAutoSpeakDragon(!autoSpeakDragon)}
                className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  autoSpeakDragon
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                <span>Audio TTS: {autoSpeakDragon ? 'ON' : 'MUTED'}</span>
              </button>
            </div>
          </div>

          {/* Quick Freestyle Conversation Starters */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
              <Lightbulb className="w-2.5 h-2.5 text-amber-400" /> Workshop Starters:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-mono">
              {[
                '🎋 How does Bonsai pruning apply to trimming joke fat?',
                '🕊️ Teach me the Origami 3-crease comedy folding theory',
                '⏰ Workshop my new 54-minute clock joke',
                '📱 What is the best roast for a heckler on TikTok?',
                '🌿 Which terpene profile pairs with deadpan crowd work?',
                '🍕 Deconstruct my Rule of Threes pizza delivery bit',
                '⏱️ Critique my 1.4-second pregnant pause timing',
                '👑 How do I elevate my bit to Super Puff GOAT level?'
              ].map(starter => (
                <button
                  key={starter}
                  onClick={() => {
                    setChatInput(starter.replace(/^[^\s]+\s/, ''));
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white/80 whitespace-nowrap transition-all"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Stream Window */}
          <div className="bg-black/70 rounded-2xl border border-white/15 p-3 sm:p-4 min-h-[320px] max-h-[480px] overflow-y-auto space-y-3 font-mono text-xs">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[8px] text-white/40 mb-1 px-1">
                  <span>{msg.sender === 'user' ? 'You (Comedy Apprentice)' : 'Dragon 9 (Student of the Craft)'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl border leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-100 rounded-tr-none'
                      : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100 rounded-tl-none shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-light">{msg.text}</p>

                  {/* If Dragon included a suggestion card */}
                  {msg.suggestedAction && (
                    <div className="mt-2.5 p-2.5 bg-black/60 rounded-xl border border-emerald-500/30 space-y-1.5 text-left">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-amber-300 font-bold uppercase truncate">
                          💡 Workshopped Concept: {msg.suggestedAction.title}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[8px] ${
                          msg.suggestedAction.masteryStatus === 'mastered'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          Verdict: {msg.suggestedAction.masteryStatus === 'mastered' ? 'Mastered' : 'Needs Practice'}
                        </span>
                      </div>

                      <p className="text-[10px] text-white/70 italic">
                        "{msg.suggestedAction.punchline}"
                      </p>

                      <button
                        onClick={() => handleAddFromChat(msg.suggestedAction!)}
                        className="w-full mt-1 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save This Concept to Comedy Archives (+50 XP)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isDragonTyping && (
              <div className="flex items-center gap-2 text-xs text-amber-400 italic">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Dragon 9 is analyzing comedic status and rolling a fresh joint...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Dragon 9 for comedy feedback, pitch a joke, or test a premise..."
              className="flex-1 bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400 font-mono"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isDragonTyping}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-400 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Workshop</span>
            </button>
          </form>
        </div>
      )}

      {/* ================= ZEN SANCTUARY VIEW (BONSAI & ORIGAMI) ================= */}
      {viewMode === 'zen' && (
        <div className="animate-in fade-in duration-300">
          <ZenBonsaiOrigamiSanctuary
            isOpen={true}
            onClose={() => setViewMode('directory')}
            onGainXp={onGainXp}
          />
        </div>
      )}

      {/* ================= FULL SCREEN ZEN CALM-DOWN OVERLAY MODAL ================= */}
      <ZenBonsaiOrigamiSanctuary
        isOpen={isZenOverlayOpen}
        isOverlay={true}
        onClose={() => setIsZenOverlayOpen(false)}
        onGainXp={onGainXp}
      />
    </div>
  );
}
