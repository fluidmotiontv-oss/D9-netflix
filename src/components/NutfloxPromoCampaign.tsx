import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Play, 
  Pause, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Layers, 
  Zap, 
  Film, 
  Smartphone, 
  Monitor, 
  Volume2, 
  Maximize2, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  FileJson,
  RotateCw
} from 'lucide-react';
import { playSingingBowlSfx, playBambooClackSfx } from '../audio/zenAudio';

export interface PromoAd {
  id: string;
  title: string;
  hook: string;
  duration: string;
  aspectRatio: string;
  targetChannels: string[];
  videoUrl: string;
  storyboard: string;
  scriptVoiceover: string;
  audioBpm: number;
  audioSpec: string;
  adHeadline: string;
  adBody: string;
  cta: string;
  techSpecs: {
    resolution: string;
    codec: string;
    colorGrading: string;
    audioMix: string;
    bitrate: string;
    fps: string;
  };
  kpiTarget: {
    hookRate: string;
    estimatedCTR: string;
    targetCAC: string;
  };
}

interface NutfloxPromoCampaignProps {
  onGainXp?: (amount: number) => void;
}

export default function NutfloxPromoCampaign({ onGainXp }: NutfloxPromoCampaignProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [promos, setPromos] = useState<PromoAd[] | null>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [selectedPromoId, setSelectedPromoId] = useState<string>('promo-1');
  const [previewAspect, setPreviewAspect] = useState<'16:9' | '9:16'>('16:9');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasExported, setHasExported] = useState(false);

  const handleGeneratePromos = async () => {
    setIsGenerating(true);
    setGenerationStep('Engaging Quantum Script Engine & Veo 3.1 Neural Prompters...');
    playBambooClackSfx();

    try {
      setTimeout(() => {
        setGenerationStep('Mastering 4K ProRes 422HQ & Rec.2020 HDR10+ Color Grading...');
      }, 700);

      setTimeout(() => {
        setGenerationStep('Synthesizing Dolby Atmos Binaural Spatial Audio (528Hz Harmonic)...');
      }, 1400);

      const res = await fetch('/api/generate-nutflox-promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      setTimeout(() => {
        setPromos(data.promos);
        setCampaignData(data.campaignManifest);
        setSelectedPromoId(data.promos[0]?.id || 'promo-1');
        setIsGenerating(false);
        playSingingBowlSfx(528);
        if (onGainXp) onGainXp(300);
      }, 2000);
    } catch (err) {
      console.warn('Fallback generating promos locally:', err);
      // Fallback robust promos
      const fallbackPromos: PromoAd[] = [
        {
          id: 'promo-1',
          title: 'Ad 1: The Holographic Temporal Glitch',
          hook: 'Linear TV is a 24-hour scam. Synchronise or stay obsolete.',
          duration: '15s High-BPM Cut',
          aspectRatio: '9:16 Vertical & 16:9 Master',
          targetChannels: ['TikTok Spark Ads', 'Instagram Reels', 'YouTube Shorts', 'Snapchat'],
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          storyboard: '0.0s: Glitching retro Nutflox VHS tape dissolves into 8K quantum hyper-render of Dragon 9. 0.3s: Neon holographic smoke burst pulses to a 145 BPM sub-bass kick. 0.9s: Dragon 9 taps a floating sovereign joint; time counter rewinds from 24h to 26.667h. 1.2s: Nutflox logo laser-ignites into the center with instantaneous unlock CTA.',
          scriptVoiceover: '[Voiceover - Gritty Cyber-Kiwi]: "They locked you into monthly subscriptions for reruns. Dragon 9 broke the timeline. Decompress the Fold. Stream in 26.667-hour real-time."',
          audioBpm: 145,
          audioSpec: 'Deep 808 sub-bass, metallic glitch impacts, binaural spatial whoosh calibrated at 528Hz harmonic resonance.',
          adHeadline: 'Stop Paying for 24-Hour Reruns. Stream Dragon 9 on Nutflox.',
          adBody: 'Traditional streaming feeds you yesterday\'s content. Nutflox is decentralized stand-up comedy unfolding live across 26.667-hour cycles. Instant sovereign unlock with zero subscription traps.',
          cta: 'Decompress Stream Now',
          techSpecs: {
            resolution: '4K UHD (3840x2160 & 2160x3840)',
            codec: 'Apple ProRes 422HQ & H.265 Master Multi-Track',
            colorGrading: 'HDR10+ / Rec.2020 Wide Color Gamut (1000 nits)',
            audioMix: 'Dolby Atmos 5.1 & Binaural Spatialization (48kHz/24-bit)',
            bitrate: '50 Mbps CBR Ultra-Low Jitter',
            fps: '60.00 fps Motion-Smoothed'
          },
          kpiTarget: {
            hookRate: '46.8% at 3s',
            estimatedCTR: '5.4%',
            targetCAC: '$0.88'
          }
        },
        {
          id: 'promo-2',
          title: 'Ad 2: The Sovereign Streaming Revolution',
          hook: 'What if Netflix had no servers, no ads, and only smoked pure truth?',
          duration: '30s Broadcast / CTV Spot',
          aspectRatio: '16:9 Cinematic Widescreen (2.39:1 Anamorphic safe)',
          targetChannels: ['YouTube In-Stream', 'Connected TV (Roku/AppleTV)', 'Reddit Video Ads', 'Meta Feeds'],
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          storyboard: '0.0s - 0.7s: Wide drone sweep across neon metropolis Babylon skyline crumbling into digital dust. 0.8s - 1.8s: Cut to Dragon 9 center stage in glowing spotlight, exhaling majestic volumetric smoke rings that form the Nutflox infinite fold. 1.9s - 3.0s: Close-up on gold-embossed Sovereign Joint pack being unsealed. Instant transition to audience laughing in 120fps slow motion. Dynamic QR code pulses with PayPal Sovereign Gateway.',
          scriptVoiceover: '[Voiceover - Calm, authoritative, dry]: "Linear time was invented by people who wanted you at work by nine. On Nutflox, time belongs to the performers. One uncompressed payment. Infinite sovereign replay. Welcome to the New."',
          audioBpm: 120,
          audioSpec: 'Cinematic hybrid orchestral strings, analog Moog synth arpeggio, clean center dialogue track with -14 LUFS broadcast normalization.',
          adHeadline: 'The World\'s First 26.667-Hour Stand-Up Comedy Special.',
          adBody: 'Watch Dragon 9 dismantle linear time, corporate hurry-sickness, and Babylon deception. No recurring credit card charges. Unlock once, own forever.',
          cta: 'Watch The Nutflox Special',
          techSpecs: {
            resolution: '4K DCI (4096x2160) Anamorphic Master',
            codec: 'ProRes 4444 XQ & AV1 Web-Ready 10-bit',
            colorGrading: 'ACEScc Workflow, P3-D65 Display Target',
            audioMix: 'Dolby Atmos 7.1.4 Bed + Object Audio / EBU R128 Compliant',
            bitrate: '65 Mbps CBR Master',
            fps: '24.00 fps Cinematic Base'
          },
          kpiTarget: {
            hookRate: '38.5% at 5s',
            estimatedCTR: '4.2%',
            targetCAC: '$1.25'
          }
        },
        {
          id: 'promo-3',
          title: 'Ad 3: Beached As Dragon9 (Viral Social Special)',
          hook: 'Yeah nah bro, can\'t fathom paying monthly subscription fees.',
          duration: '60s Viral Social Director\'s Cut',
          aspectRatio: '1:1 Square & 9:16 Vertical Cut',
          targetChannels: ['TikTok Viral Campaign', 'Instagram Stories/Reels', 'X Video', 'YouTube Shorts'],
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          storyboard: '0.0s - 0.5s: Sunny golden Tasman beach shore. A confused cartoon seagull swoops in: "Bro! You\'re beached! Where\'s your streaming subscription?!" 0.6s - 1.5s: Dragon 9 turns around with glowing sunglasses: "Yeah nah bro. I\'m a Dragon9. Can\'t fathom subscription traps." 1.6s - 3.5s: Fast-cut montage of high-energy stand-up punchlines, crowd hysteria, and fractal origami smoke bursts. 3.6s - 6.0s: Seagull tries to offer a chip. Dragon 9 vaporizes the chip into a sovereign streaming token.',
          scriptVoiceover: '[Dragon 9 - Authentic Kiwi stoner dragon]: "Look bro, Babylon wants your direct debit every month for movies you watched in 2014. On Nutflox, you unfold the archives when you want. Sweet as. Have a chip? Yeah nah, stream Dragon 9 instead bro."',
          audioBpm: 105,
          audioSpec: 'Warm dub reggae bassline, procedural ocean surf wash, crisp vinyl crackle, punchy vocal master with punchline rimshots.',
          adHeadline: 'Beached As Bro. The Nutflox Special is Live.',
          adBody: 'Unfathomable value. Unfiltered comedy. Watch Dragon 9 live on Nutflox now. Simulated PayPal checkout & Sovereign Jewel Slot support enabled.',
          cta: 'Stream Free Preview',
          techSpecs: {
            resolution: '4K UHD (3840x2160) Multi-Aspect Adaptive',
            codec: 'H.265 / HEVC Main10 & WebM VP9 Low-Latency',
            colorGrading: 'Rec.709 & HDR10 Simultaneous Dual-Deliverable',
            audioMix: 'Stereo Spatialized & Mono-Compatible Master (-16 LUFS)',
            bitrate: '35 Mbps Adaptive Variable Bitrate',
            fps: '60.00 fps High Smoothness'
          },
          kpiTarget: {
            hookRate: '52.1% at 3s',
            estimatedCTR: '6.8%',
            targetCAC: '$0.62'
          }
        }
      ];

      setTimeout(() => {
        setPromos(fallbackPromos);
        setSelectedPromoId('promo-1');
        setIsGenerating(false);
        playSingingBowlSfx(528);
      }, 1500);
    }
  };

  const currentPromo = promos ? promos.find(p => p.id === selectedPromoId) || promos[0] : null;

  const handleCopyAdPackage = (promo: PromoAd) => {
    const text = `=== NUTFLOX SPECIAL AD CAMPAIGN ASSET ===
Title: ${promo.title}
Hook: ${promo.hook}
Duration: ${promo.duration}
Channels: ${promo.targetChannels.join(', ')}
Headline: ${promo.adHeadline}
Primary Text: ${promo.adBody}
Call To Action: ${promo.cta}
Tech Specifications:
- Resolution: ${promo.techSpecs.resolution}
- Codec: ${promo.techSpecs.codec}
- Color: ${promo.techSpecs.colorGrading}
- Audio: ${promo.techSpecs.audioMix}
- Framerate: ${promo.techSpecs.fps}
Estimated KPI Target:
- 3s Hook Rate: ${promo.kpiTarget.hookRate}
- Target CTR: ${promo.kpiTarget.estimatedCTR}
- Target CAC: ${promo.kpiTarget.targetCAC}
Video Master Link: ${promo.videoUrl}
=========================================`;

    navigator.clipboard.writeText(text);
    setCopiedId(promo.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCampaignKit = () => {
    if (!promos) return;
    const kitData = {
      campaignManifest: {
        campaignName: 'Nutflox Special - Global Video Ad Launch',
        generatedAt: new Date().toISOString(),
        adCount: promos.length,
        deploymentChannels: ['Meta Ads Manager', 'TikTok Ads Manager', 'Google Ads / YouTube Video', 'X Ads'],
        trackingParams: {
          utm_source: 'nutflox_video_promo',
          utm_medium: 'paid_social',
          utm_campaign: 'd9_special_launch_26h'
        }
      },
      promos
    };

    const blob = new Blob([JSON.stringify(kitData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutflox_special_3_video_promos_campaign_kit_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setHasExported(true);
    setTimeout(() => setHasExported(false), 3000);
    playBambooClackSfx();
    if (onGainXp) onGainXp(150);
  };

  return (
    <div className="mt-12 pt-10 border-t border-red-500/20 space-y-8 animate-in fade-in duration-300">
      
      {/* Campaign Generator Action Banner */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-black to-amber-950/40 border border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono uppercase tracking-widest">
              <Film className="w-3.5 h-3.5 animate-pulse" />
              <span>Broadcast Ad Automation Engine</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              3 Video Promo Advertisements <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">• Nutflox Special</span>
            </h3>
            <p className="text-sm text-white/70 font-mono max-w-2xl leading-relaxed">
              Generate 3 future-proofed, ultra-high-tech video advertisements engineered for immediate deployment across TikTok, Reels, YouTube CTV, and Meta ad networks.
            </p>
          </div>

          <button
            onClick={handleGeneratePromos}
            disabled={isGenerating}
            className="w-full lg:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-black font-black font-mono text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] disabled:opacity-60 flex items-center justify-center gap-3 shrink-0"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                <span>Synthesizing Promos...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-black" />
                <span>⚡ Generate 3 Video Promos</span>
              </>
            )}
          </button>
        </div>

        {/* Live Generation Progress Display */}
        {isGenerating && (
          <div className="mt-6 p-4 rounded-2xl bg-black/80 border border-red-500/30 font-mono text-xs text-red-300 animate-pulse flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>{generationStep || 'Compiling ad masters...'}</span>
          </div>
        )}
      </div>

      {/* Generated Promos Interactive Studio */}
      {promos && currentPromo && (
        <div className="space-y-6">
          
          {/* Top Bar: Selector Tabs & Global Export Kit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {promos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPromoId(p.id);
                    playBambooClackSfx();
                  }}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                    selectedPromoId === p.id 
                      ? 'bg-red-500/20 border-red-400 text-white font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                      : 'bg-black/40 border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{p.title.split(':')[0] || `Ad ${idx + 1}`}</span>
                  <span className="ml-2 text-[10px] text-amber-400 font-normal">({p.duration})</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCampaignKit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-widest transition-all shrink-0"
            >
              {hasExported ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <FileJson className="w-4 h-4 text-amber-400" />}
              <span>{hasExported ? 'Manifest Exported!' : 'Export Campaign Kit (.JSON)'}</span>
            </button>
          </div>

          {/* Active Promo Detailed Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: High-Tech Video Preview Player */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-black/70 border border-red-500/30 backdrop-blur-md space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-widest font-bold">
                    <Video className="w-4 h-4" />
                    <span>Active Master Video Preview</span>
                  </div>
                  
                  {/* Aspect Ratio Simulator Switcher */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
                    <button
                      onClick={() => setPreviewAspect('16:9')}
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        previewAspect === '16:9' ? 'bg-red-500 text-black font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>16:9</span>
                    </button>
                    <button
                      onClick={() => setPreviewAspect('9:16')}
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        previewAspect === '9:16' ? 'bg-red-500 text-black font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>9:16</span>
                    </button>
                  </div>
                </div>

                {/* Video Stage Frame */}
                <div className="relative rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center">
                  <div className={`transition-all duration-300 w-full ${previewAspect === '9:16' ? 'max-w-[280px] aspect-[9/16] my-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-red-500/40 rounded-xl overflow-hidden' : 'aspect-video'}`}>
                    <video
                      key={currentPromo.videoUrl}
                      src={currentPromo.videoUrl}
                      controls
                      autoPlay={false}
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* High-Tech Overlay Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 border border-red-500/50 font-mono text-[9px] text-red-300 uppercase tracking-widest pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>NUTFLOX // MASTER FEED</span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[9px] text-white/50 pointer-events-none">
                    {currentPromo.techSpecs.resolution.split(' ')[0]} • {currentPromo.techSpecs.fps}
                  </div>
                </div>

                {/* Video Quick Controls & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={currentPromo.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Direct Video Master Link</span>
                  </a>

                  <button
                    onClick={() => handleCopyAdPackage(currentPromo)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    {copiedId === currentPromo.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">Ad Package Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Ad Package</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Performance KPI Forecast */}
              <div className="p-5 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md">
                <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Campaign Performance Forecast</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] font-mono text-white/40 uppercase">3s Hook Rate</div>
                    <div className="text-base font-black text-emerald-400 font-mono mt-0.5">{currentPromo.kpiTarget.hookRate}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] font-mono text-white/40 uppercase">Est. CTR</div>
                    <div className="text-base font-black text-amber-400 font-mono mt-0.5">{currentPromo.kpiTarget.estimatedCTR}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] font-mono text-white/40 uppercase">Target CAC</div>
                    <div className="text-base font-black text-cyan-400 font-mono mt-0.5">{currentPromo.kpiTarget.targetCAC}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tech Specs & Creative Package */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Ad Copy & Headline Card */}
              <div className="p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">
                    Campaign Headline & Hook
                  </div>
                  <h4 className="text-xl font-black text-white">{currentPromo.adHeadline}</h4>
                  <p className="text-sm font-mono text-amber-300/90 mt-1 italic">&ldquo;{currentPromo.hook}&rdquo;</p>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
                    Primary Ad Body Text
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans bg-white/5 p-3.5 rounded-xl border border-white/5">
                    {currentPromo.adBody}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="text-xs font-mono text-white/60">
                    Primary CTA: <span className="text-red-400 font-bold">{currentPromo.cta}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentPromo.targetChannels.slice(0, 3).map((ch, i) => (
                      <span key={i} className="text-[9px] font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Storyboard & Spoken Script Card */}
              <div className="p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md space-y-3">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>Veo 3.1 Storyboard & Voiceover Prompt</span>
                </div>
                
                <div className="p-3.5 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-white/80 leading-relaxed space-y-2">
                  <div>
                    <span className="text-white/40 uppercase text-[10px] block mb-0.5">Visual Flow:</span>
                    {currentPromo.storyboard}
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-amber-400/80 uppercase text-[10px] block mb-0.5">Voiceover Dialogue:</span>
                    <span className="text-amber-200">{currentPromo.scriptVoiceover}</span>
                  </div>
                </div>
              </div>

              {/* Best Tech Execution & Future-Proofed Specifications */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-black/80 to-[#12071a]/80 border border-purple-500/30 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
                  <div className="text-xs font-mono text-purple-300 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Future-Proofed Technical Execution</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    PRODUCE-READY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                    <div className="text-[9px] text-white/40 uppercase">Master Format</div>
                    <div className="text-white font-bold mt-0.5 truncate">{currentPromo.techSpecs.resolution}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                    <div className="text-[9px] text-white/40 uppercase">Video Codec</div>
                    <div className="text-white font-bold mt-0.5 truncate">{currentPromo.techSpecs.codec}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                    <div className="text-[9px] text-white/40 uppercase">Color Target</div>
                    <div className="text-white font-bold mt-0.5 truncate">{currentPromo.techSpecs.colorGrading}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                    <div className="text-[9px] text-white/40 uppercase">Audio Mix</div>
                    <div className="text-white font-bold mt-0.5 truncate">{currentPromo.techSpecs.audioMix}</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
