import React, { useState, useEffect } from 'react';
import { X, Key, Database, Check, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { MondayConfig } from '../types';

interface MondayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MondayConfig;
  onSaveConfig: (newConfig: Partial<MondayConfig>) => void;
}

export const MondayConfigModal: React.FC<MondayConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [token, setToken] = useState(config.apiToken);
  const [dealsBoardId, setDealsBoardId] = useState(config.dealsBoardId);
  const [workOrdersBoardId, setWorkOrdersBoardId] = useState(config.workOrdersBoardId);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Sync state whenever modal opens or config changes
  useEffect(() => {
    if (isOpen) {
      setToken(config.apiToken);
      setDealsBoardId(config.dealsBoardId);
      setWorkOrdersBoardId(config.workOrdersBoardId);
      setSaveStatus(null);
      setTestResult(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!token.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid API token.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? '/api/monday' 
      : 'https://api.monday.com/v2';

    const tokenStr = token.trim();
    const authHeaders = [tokenStr, `Bearer ${tokenStr}`];

    let lastErrorMessage = '';

    for (const authHeader of authHeaders) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
            'API-Version': '2023-10'
          },
          body: JSON.stringify({ query: 'query { me { id name email } }' })
        });

        const data = await response.json();
        if (response.ok && !data.errors) {
          setTestResult({
            success: true,
            message: `Connected successfully as ${data.data?.me?.name || 'User'} (${data.data?.me?.email || 'Authenticated'})!`
          });
          setIsTesting(false);
          return;
        } else {
          lastErrorMessage = data.errors?.[0]?.message || (response.status === 401 ? 'HTTP 401: Invalid API token or insufficient permissions.' : `HTTP ${response.status} Error`);
        }
      } catch (err: any) {
        lastErrorMessage = err.message;
      }
    }

    setTestResult({ success: false, message: lastErrorMessage });
    setIsTesting(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving connection...');
    
    onSaveConfig({
      apiToken: token.trim(),
      dealsBoardId: dealsBoardId.trim(),
      workOrdersBoardId: workOrdersBoardId.trim(),
      isConnected: !!token.trim(),
      isDemoMode: !token.trim()
    });

    setSaveStatus('Connection saved successfully!');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleSwitchToDemo = () => {
    setToken('');
    setDealsBoardId('');
    setWorkOrdersBoardId('');
    onSaveConfig({
      apiToken: '',
      dealsBoardId: '',
      workOrdersBoardId: '',
      isConnected: false,
      isDemoMode: true
    });
    setSaveStatus('Switched to Offline Demo Dataset!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg bg-dark-card border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Monday.com API Configuration</h3>
              <p className="text-xs text-gray-400">GraphQL API v2 Connection & Board Mapping</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
          config.apiToken ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.apiToken ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-bold">{config.apiToken ? 'Monday.com API Token Configured' : 'Offline Demo Mode Active (Skylark Sample Dataset)'}</span>
          </div>
          {!config.apiToken && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400/20">Zero-Config</span>
          )}
        </div>

        {/* Feedback Messages */}
        {saveStatus && (
          <div className="p-3 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-brand-400" />
            <span>{saveStatus}</span>
          </div>
        )}

        {testResult && (
          <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {testResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-400" />
                Monday.com Personal Access Token
              </label>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                <span>{isTesting ? 'Testing API...' : 'Test Connection'}</span>
              </button>
            </div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your API token here..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">Obtain from Monday.com -&gt; Developer -&gt; API Tokens.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Deals Board ID (Optional)
              </label>
              <input
                type="text"
                value={dealsBoardId}
                onChange={(e) => setDealsBoardId(e.target.value)}
                placeholder="e.g. 1234567890"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Work Orders Board ID (Optional)
              </label>
              <input
                type="text"
                value={workOrdersBoardId}
                onChange={(e) => setWorkOrdersBoardId(e.target.value)}
                placeholder="e.g. 0987654321"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between gap-3 border-t border-gray-800">
            <button
              type="button"
              onClick={handleSwitchToDemo}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Use Offline Demo Dataset
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Connection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
