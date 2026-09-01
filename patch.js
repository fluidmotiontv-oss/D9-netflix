const fs = require('fs');
let code = fs.readFileSync('src/components/Theater.tsx', 'utf8');
const search = `             </button>
          </div>

          <div className="space-y-4 flex-1">`;
const replace = `             </button>
             <button
               className={\`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap \${
                 activeTab === 'nft' ? 'text-white font-bold' : 'border-transparent text-white/50 hover:text-white'
               }\`}
               style={{
                 borderColor: activeTab === 'nft' ? currentMood.primary : 'transparent',
                 color: activeTab === 'nft' ? currentMood.accent : undefined,
               }}
               onClick={() => handleTabChange('nft')}
             >
               Sovereign
             </button>
             <button
               className={\`px-3 pb-2 text-[9px] font-mono tracking-widest uppercase transition-colors border-b-2 whitespace-nowrap \${
                 activeTab === 'nutflox' ? 'text-white font-bold' : 'border-transparent text-white/50 hover:text-white'
               }\`}
               style={{
                 borderColor: activeTab === 'nutflox' ? currentMood.primary : 'transparent',
                 color: activeTab === 'nutflox' ? currentMood.accent : undefined,
               }}
               onClick={() => handleTabChange('nutflox')}
             >
               Nutflox
             </button>
          </div>

          <div className="space-y-4 flex-1">`;
if (code.includes(search)) {
  code = code.replace(search, replace);
  fs.writeFileSync('src/components/Theater.tsx', code);
  console.log('Patched buttons successfully.');
} else {
  console.log('Search string not found in Theater.tsx');
}
