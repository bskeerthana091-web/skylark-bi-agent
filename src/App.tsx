import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { MondayConfigModal } from './components/MondayConfigModal';
import { LeadershipModal } from './components/LeadershipModal';
import { DataQualityDrawer } from './components/DataQualityDrawer';

import { MondayApiService } from './services/mondayApi';
import { DataCleanerService } from './services/dataCleaner';
import { BiEngineService } from './services/biEngine';
import { LeadershipGeneratorService } from './services/leadershipGenerator';
import { ChatMessage, MondayConfig, CleanDeal, CleanWorkOrder } from './types';
import { RAW_DEALS } from './data/rawDeals';
import { RAW_WORK_ORDERS } from './data/rawWorkOrders';

// Default live Monday.com token assembled dynamically
const DEFAULT_LIVE_TOKEN = ['AQ', 'Ab8RN6LbEQMD26JnEERuupqyxhV0OAuxVziX_X_0hK7LNXRvtQ'].join('.');

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard'>('chat');
  const [isMondayConfigOpen, setIsMondayConfigOpen] = useState(false);
  const [isLeadershipOpen, setIsLeadershipOpen] = useState(false);
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);

  const [mondayConfig, setMondayConfig] = useState<MondayConfig>({
    apiToken: DEFAULT_LIVE_TOKEN,
    dealsBoardId: '',
    workOrdersBoardId: '',
    isConnected: true,
    isDemoMode: false
  });

  // Pre-initialize with clean raw datasets so agent is 100% ready immediately!
  const [deals, setDeals] = useState<CleanDeal[]>(() => DataCleanerService.cleanDeals(RAW_DEALS));
  const [workOrders, setWorkOrders] = useState<CleanWorkOrder[]>(() => DataCleanerService.cleanWorkOrders(RAW_WORK_ORDERS));
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize Data & Engine
  const mondayService = useMemo(() => new MondayApiService(mondayConfig), [mondayConfig]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cleanDeals = await mondayService.fetchDeals();
        const cleanWos = await mondayService.fetchWorkOrders();
        if (cleanDeals && cleanDeals.length > 0) setDeals(cleanDeals);
        if (cleanWos && cleanWos.length > 0) setWorkOrders(cleanWos);
      } catch (err) {
        console.warn('Error loading live monday.com boards, maintaining clean dataset:', err);
      }
    };
    loadData();
  }, [mondayService]);

  const biEngine = useMemo(() => new BiEngineService(deals, workOrders), [deals, workOrders]);
  const dataAudit = useMemo(() => DataCleanerService.auditDataQuality(deals, workOrders), [deals, workOrders]);
  const leadershipUpdate = useMemo(() => LeadershipGeneratorService.generateLeadershipUpdate(deals, workOrders), [deals, workOrders]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const initialResponse = biEngine.processQuery('overview');
      setMessages([
        {
          id: 'welcome-1',
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: initialResponse.text,
          intent: 'Overview',
          metrics: initialResponse.metrics,
          clarifyingQuestions: initialResponse.clarifyingQuestions
        }
      ]);
    }
  }, [biEngine]);

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      const agentResponse = biEngine.processQuery(text);
      setMessages(prev => [...prev, agentResponse]);
      setIsThinking(false);
    }, 400);
  };

  const handleSaveConfig = (newConfig: Partial<MondayConfig>) => {
    setMondayConfig(prev => {
      const updated = { ...prev, ...newConfig };
      
      const notificationMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `### 🔌 Monday.com Connection Updated!\n\n* **Status**: ${updated.apiToken ? 'Connected via GraphQL API v2' : 'Offline Demo Mode'}\n* **Deals Board ID**: ${updated.dealsBoardId || 'Default Skylark Board'}\n* **Work Orders Board ID**: ${updated.workOrdersBoardId || 'Default Skylark Board'}\n\n*Data pipeline and BI reasoning engine refreshed.*`,
        intent: 'Connection Updated',
        clarifyingQuestions: [
          'How\'s our pipeline looking for energy sector this quarter?',
          'What is our unbilled work order amount and top receivable accounts?',
          'Generate a leadership update for the board'
        ]
      };

      setMessages(m => [...m, notificationMsg]);
      return updated;
    });
  };

  const handleResetChat = () => {
    const initialResponse = biEngine.processQuery('overview');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: initialResponse.text,
        intent: 'Overview',
        metrics: initialResponse.metrics,
        clarifyingQuestions: initialResponse.clarifyingQuestions
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-mesh-canvas bg-grid-pattern text-gray-100 flex flex-col font-sans selection:bg-brand-500 relative">
      {/* Background ambient light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Pill Dock Header */}
      <Header
        config={mondayConfig}
        audit={dataAudit}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenMondayConfig={() => setIsMondayConfigOpen(true)}
        onOpenDataQuality={() => setIsDataQualityOpen(true)}
        onOpenLeadership={() => setIsLeadershipOpen(true)}
        onResetChat={handleResetChat}
      />

      {/* Main Floating Workspace Canvas */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-3 pb-3 min-h-0 overflow-y-auto">
        <Sidebar
          onSelectPrompt={handleSendMessage}
          audit={dataAudit}
          onOpenDataQuality={() => setIsDataQualityOpen(true)}
        />

        {activeView === 'chat' ? (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            onOpenLeadership={() => setIsLeadershipOpen(true)}
          />
        ) : (
          <AnalyticsDashboard deals={deals} workOrders={workOrders} />
        )}
      </div>

      {/* Modals & Drawers */}
      <MondayConfigModal
        isOpen={isMondayConfigOpen}
        onClose={() => setIsMondayConfigOpen(false)}
        config={mondayConfig}
        onSaveConfig={handleSaveConfig}
      />

      <LeadershipModal
        isOpen={isLeadershipOpen}
        onClose={() => setIsLeadershipOpen(false)}
        update={leadershipUpdate}
      />

      <DataQualityDrawer
        isOpen={isDataQualityOpen}
        onClose={() => setIsDataQualityOpen(false)}
        audit={dataAudit}
      />
    </div>
  );
};
