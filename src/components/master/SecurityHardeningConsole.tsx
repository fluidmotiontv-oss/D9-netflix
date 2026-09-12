import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

interface SecurityControl {
  id: string;
  category: 'firewall' | 'ssh' | 'secrets' | 'system';
  risk: 'Critical' | 'High' | 'Medium';
  title: string;
  verificationCommand: string;
  remediationSnippet: string;
  status: 'verified' | 'recommended';
}

const SECURITY_CONTROLS: SecurityControl[] = [
  {
    id: 'fw-1',
    category: 'firewall',
    risk: 'Critical',
    title: 'UFW Default Drop Inbound Policy',
    verificationCommand: 'sudo ufw status verbose | grep "Default:"',
    remediationSnippet: 'sudo ufw default deny incoming\nsudo ufw default allow outgoing',
    status: 'verified',
  },
  {
    id: 'fw-2',
    category: 'firewall',
    risk: 'High',
    title: 'Rate-Limited SSH Port Rule',
    verificationCommand: 'sudo ufw status verbose | grep "22/tcp"',
    remediationSnippet: 'sudo ufw limit 22/tcp comment "Rate-limited SSH"',
    status: 'verified',
  },
  {
    id: 'fw-3',
    category: 'firewall',
    risk: 'Critical',
    title: 'Public Ingress Restricted to Ports 80 & 443',
    verificationCommand: 'sudo ufw status numbered | grep -E "80/tcp|443/tcp"',
    remediationSnippet: 'sudo ufw allow 80/tcp\nsudo ufw allow 443/tcp',
    status: 'verified',
  },
  {
    id: 'fw-4',
    category: 'firewall',
    risk: 'Critical',
    title: 'Node.js (3000) & DB Loopback Isolation',
    verificationCommand: 'sudo ss -tulpn | grep -E ":3000|:5432"',
    remediationSnippet: '# Ensure Node and DB bind only to 127.0.0.1 or behind reverse proxy',
    status: 'verified',
  },
  {
    id: 'fw-5',
    category: 'firewall',
    risk: 'Medium',
    title: 'Stateful Connection Tracking & Invalid Packet Drop',
    verificationCommand: 'sudo iptables -L INPUT -v -n | grep -i "state"',
    remediationSnippet: 'sudo iptables -A INPUT -m conntrack --ctstate INVALID -j DROP',
    status: 'recommended',
  },
  {
    id: 'ssh-1',
    category: 'ssh',
    risk: 'Critical',
    title: 'Disable SSH Password Authentication',
    verificationCommand: 'sshd -T | grep -i "passwordauthentication"',
    remediationSnippet: 'echo "PasswordAuthentication no" | sudo tee -a /etc/ssh/sshd_config.d/security.conf',
    status: 'verified',
  },
  {
    id: 'ssh-2',
    category: 'ssh',
    risk: 'Critical',
    title: 'Disable Direct Root SSH Login (PermitRootLogin no)',
    verificationCommand: 'sshd -T | grep -i "permitrootlogin"',
    remediationSnippet: 'echo "PermitRootLogin no" | sudo tee -a /etc/ssh/sshd_config.d/security.conf',
    status: 'verified',
  },
  {
    id: 'ssh-3',
    category: 'ssh',
    risk: 'High',
    title: 'Enforce Modern Ed25519 Cryptographic Public Keys',
    verificationCommand: 'cat ~/.ssh/authorized_keys | awk "{print $1, $NF}"',
    remediationSnippet: 'ssh-keygen -t ed25519 -C "admin@master-app"',
    status: 'verified',
  },
  {
    id: 'ssh-4',
    category: 'ssh',
    risk: 'Medium',
    title: 'SSH Inactivity Timeout & Keepalive Limits',
    verificationCommand: 'sshd -T | grep -E "clientaliveinterval|clientalivecountmax"',
    remediationSnippet: 'ClientAliveInterval 300\nClientAliveCountMax 2',
    status: 'recommended',
  },
  {
    id: 'sec-1',
    category: 'secrets',
    risk: 'Critical',
    title: 'Strict File Permissions on .env Files (chmod 600)',
    verificationCommand: 'stat -c "%a %U:%G %n" /opt/master-app/.env',
    remediationSnippet: 'chmod 600 /opt/master-app/.env\nchown nodeapp:nodeapp /opt/master-app/.env',
    status: 'verified',
  },
  {
    id: 'sec-2',
    category: 'secrets',
    risk: 'Critical',
    title: 'Prevent .env Leaks via .gitignore',
    verificationCommand: 'git check-ignore -v .env .env.local 2>/dev/null',
    remediationSnippet: 'echo ".env\n.env.*\n*.pem" >> .gitignore',
    status: 'verified',
  },
  {
    id: 'sec-3',
    category: 'secrets',
    risk: 'Critical',
    title: 'Client vs Server Variable Separation (GEMINI_API_KEY vs VITE_*)',
    verificationCommand: 'grep -rn --include="*.ts*" -E "VITE_.*(KEY|SECRET|PASS|TOKEN)" src/ || echo "Client bundle clean"',
    remediationSnippet: '# Keep GEMINI_API_KEY without VITE_ prefix in server-only scope',
    status: 'verified',
  },
  {
    id: 'sec-4',
    category: 'secrets',
    risk: 'High',
    title: 'Systemd EnvironmentFile & Process Sandbox Directives',
    verificationCommand: 'systemctl cat master-app.service | grep -E "EnvironmentFile|PrivateTmp|ProtectSystem"',
    remediationSnippet: 'ProtectSystem=full\nProtectHome=true\nPrivateTmp=true',
    status: 'verified',
  },
  {
    id: 'sys-1',
    category: 'system',
    risk: 'Critical',
    title: 'Dedicated Non-Privileged Service User (nodeapp)',
    verificationCommand: 'ps aux | grep "dist/server.cjs" | grep -v "root"',
    remediationSnippet: 'sudo useradd -r -s /bin/false nodeapp',
    status: 'verified',
  },
  {
    id: 'sys-2',
    category: 'system',
    risk: 'High',
    title: 'Unattended Automatic OS Security Updates',
    verificationCommand: 'systemctl is-active unattended-upgrades',
    remediationSnippet: 'sudo apt-get install unattended-upgrades && sudo dpkg-reconfigure --priority=low unattended-upgrades',
    status: 'recommended',
  },
];

export default function SecurityHardeningConsole() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredControls = selectedCategory === 'all'
    ? SECURITY_CONTROLS
    : SECURITY_CONTROLS.filter(c => c.category === selectedCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const verifiedCount = SECURITY_CONTROLS.filter(c => c.status === 'verified').length;

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-8 bg-[#040407] text-white/90">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">Local Environment Security Hardening</h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {verifiedCount} / {SECURITY_CONTROLS.length} Controls Verified
              </span>
            </div>
            <p className="text-xs text-white/60 font-light">
              Audit matrix derived from Principal Systems Architect specification: firewall, SSH authentication, secrets, and daemon sandboxes.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            {['all', 'firewall', 'ssh', 'secrets', 'system'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(147,51,234,0.4)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Security Controls Table / Cards */}
        <div className="space-y-3">
          {filteredControls.map((ctrl) => {
            const isCritical = ctrl.risk === 'Critical';
            const isHigh = ctrl.risk === 'High';

            return (
              <div
                key={ctrl.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {ctrl.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        isCritical
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {ctrl.risk}
                    </span>
                    <h3 className="text-xs font-bold text-white tracking-wide">
                      {ctrl.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{ctrl.status === 'verified' ? 'ENFORCED' : 'RECOMMENDED'}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                  {/* Verification Command */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-white/40">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        <span>Verification Command</span>
                      </span>
                      <button
                        onClick={() => handleCopy(ctrl.verificationCommand, ctrl.id + '-ver')}
                        className="hover:text-white transition-colors"
                      >
                        {copiedId === ctrl.id + '-ver' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="text-[11px] text-cyan-300 select-all truncate">
                      {ctrl.verificationCommand}
                    </div>
                  </div>

                  {/* Remediation Snippet */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-white/40">
                      <span className="flex items-center gap-1">
                        <FileCode className="w-3 h-3 text-purple-400" />
                        <span>Remediation Directive</span>
                      </span>
                      <button
                        onClick={() => handleCopy(ctrl.remediationSnippet, ctrl.id + '-rem')}
                        className="hover:text-white transition-colors"
                      >
                        {copiedId === ctrl.id + '-rem' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="text-[11px] text-purple-300 select-all truncate">
                      {ctrl.remediationSnippet}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
