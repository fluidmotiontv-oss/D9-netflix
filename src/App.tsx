import { motion } from 'motion/react';
import { Copy, Check, Sparkles, Terminal } from 'lucide-react';
import { useState } from 'react';
import { ACTS, CORE_PREMISE, PROMPTS } from './data';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/20 text-white/40 hover:text-orange-500 transition-colors border border-white/10 hover:border-orange-500/50 group"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-orange-500" />
      ) : (
        <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-orange-900/50 selection:text-orange-100 relative overflow-hidden">
      {/* Background Grid & Gradient */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-24 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-500 text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <Sparkles className="w-4 h-4" />
            Netflix Original Special Pitch
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase">
            DRAGON 9 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              SYNCHRONISE TIME
            </span>
          </h1>
          <p className="text-xl text-white/50 font-light tracking-[0.2em] uppercase max-w-2xl mx-auto leading-relaxed mt-4">
            An Animated Stand-Up Special
          </p>
        </motion.header>

        {/* Core Premise */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="bg-[#0a0a0a]/80 rounded-xl p-8 md:p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 text-[10px] font-mono opacity-30">PREMISE_DAT</div>
              <h2 className="text-2xl font-bold text-orange-500 mb-4 flex items-center gap-3 uppercase tracking-wider">
                <Terminal className="w-6 h-6 text-orange-500" />
                {CORE_PREMISE.title}
              </h2>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                {CORE_PREMISE.description}
              </p>
            </div>
          </div>
        </motion.section>

        {/* The Stand-Up Set */}
        <section className="mb-24">
          <h2 className="text-3xl font-black text-white mb-12 text-center uppercase tracking-tight">
            The Stand-Up Set Breakdown
          </h2>
          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[28px] md:before:left-1/2 before:w-px before:bg-gradient-to-b before:from-transparent before:via-orange-500/30 before:to-transparent">
            {ACTS.map((act, index) => {
              const isEven = index % 2 === 0;
              const Icon = act.icon;
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start gap-8 md:justify-between ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="hidden md:block w-5/12" />
                  
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-[#0a0a0a] border-2 border-orange-500/50 z-10 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="w-full md:w-5/12 pl-20 md:pl-0">
                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-orange-500/50 transition-colors group relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                      <div className="absolute top-0 right-0 p-3 text-[10px] font-mono opacity-30 uppercase group-hover:text-orange-500 transition-colors">ACT_SEQ_0{index+1}</div>
                      <div className="text-orange-500 text-xs font-mono font-bold tracking-[0.1em] mb-2">
                        {act.time}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                        {act.title}
                      </h3>
                      <div className="space-y-4 text-sm text-white/40 leading-relaxed">
                        <p><strong className="text-white/70 font-medium uppercase text-xs tracking-wider">The Bit:</strong> {act.bit}</p>
                        <p><strong className="text-orange-400/80 font-medium uppercase text-xs tracking-wider">Visual Gag:</strong> {act.gag}</p>
                        <p><strong className="text-white/70 font-medium uppercase text-xs tracking-wider">Audio Cue:</strong> {act.audio}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Production Workflow Prompts */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Production Workflow Prompts</h2>
            <p className="text-white/50 tracking-widest text-sm uppercase">Generative AI directives for look development</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1 max-w-3xl mx-auto">
            {PROMPTS.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md relative"
                >
                  <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10">
                    <div className="flex items-center gap-3 text-white font-bold tracking-wider uppercase text-sm">
                      <Icon className="w-5 h-5 text-orange-500" />
                      {prompt.title}
                    </div>
                    <CopyButton text={prompt.prompt} />
                  </div>
                  <div className="p-6">
                    <pre className="text-sm font-mono text-white/50 whitespace-pre-wrap leading-relaxed">
                      {prompt.prompt}
                    </pre>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
