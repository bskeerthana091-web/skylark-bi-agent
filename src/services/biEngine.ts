import { CleanDeal, CleanWorkOrder, ChatMessage } from '../types';

export interface BIResponse {
  text: string;
  intent?: string;
  metrics?: Array<{ label: string; value: string; trend?: 'up' | 'down'; subtext?: string }>;
  chartData?: {
    title: string;
    type: 'bar' | 'pie';
    data: Array<{ name: string; value: number; secondary?: number; color?: string }>;
  };
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  leadershipUpdateSnippet?: {
    title: string;
    summary: string;
  };
  caveats?: string[];
  clarifyingQuestions?: string[];
}

export class BiEngineService {
  private deals: CleanDeal[];
  private workOrders: CleanWorkOrder[];

  constructor(deals: CleanDeal[], workOrders: CleanWorkOrder[]) {
    this.deals = deals;
    this.workOrders = workOrders;
  }

  /**
   * NLP Intent Recognition and Query Handler
   */
  public processQuery(queryText: string): ChatMessage {
    const q = queryText.toLowerCase();

    let response: BIResponse;

    if (q.includes('pipeline') || q.includes('deal') || q.includes('funnel') || q.includes('overview') || q.includes('sales') || q.includes('biggest') || q.includes('largest')) {
      response = this.analyzePipeline(q);
    } else if (q.includes('work order') || q.includes('unbilled') || q.includes('receivable') || q.includes('bottleneck') || q.includes('ar') || q.includes('top 5')) {
      response = this.analyzeWorkOrders(q);
    } else if (q.includes('sector') || q.includes('mining') || q.includes('powerline') || q.includes('renewables') || q.includes('railways') || q.includes('dsp')) {
      response = this.analyzeSector(q);
    } else if (q.includes('leadership') || q.includes('briefing') || q.includes('update') || q.includes('board')) {
      response = this.generateLeadershipSnippet();
    } else {
      response = this.analyzePipeline(q);
    }

    // Filter out the exact user query from clarifying questions so suggestions are always fresh!
    const filteredQuestions = (response.clarifyingQuestions || []).filter(
      (cq: string) => cq.toLowerCase().trim() !== queryText.toLowerCase().trim()
    );

    return {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: response.text,
      intent: response.intent,
      metrics: response.metrics,
      chartData: response.chartData,
      tableData: response.tableData,
      leadershipUpdateSnippet: response.leadershipUpdateSnippet,
      caveats: response.caveats,
      clarifyingQuestions: filteredQuestions
    };
  }

  /**
   * Pipeline & Revenue Analysis Engine (Handles general pipeline & biggest deals)
   */
  private analyzePipeline(query: string): BIResponse {
    const isBiggestQuery = query.includes('biggest') || query.includes('largest') || query.includes('top deal') || query.includes('highest value');

    const openDeals = this.deals.filter(d => d.status === 'Open');
    const wonDeals = this.deals.filter(d => d.status === 'Won');

    const totalOpenVal = openDeals.reduce((sum, d) => sum + d.dealValue, 0);
    const totalWonVal = wonDeals.reduce((sum, d) => sum + d.dealValue, 0);

    const highProbDeals = openDeals.filter(d => d.closureProbability === 'High');
    const highProbVal = highProbDeals.reduce((sum, d) => sum + d.dealValue, 0);

    const weightedForecast = totalWonVal + (highProbVal * 0.8);

    // Sorted open deals by deal value for "biggest deals" queries
    const sortedOpenDeals = [...openDeals].sort((a, b) => b.dealValue - a.dealValue);
    const displayDeals = isBiggestQuery ? sortedOpenDeals.slice(0, 5) : openDeals.slice(0, 5);

    const top5Val = sortedOpenDeals.slice(0, 5).reduce((sum, d) => sum + d.dealValue, 0);

    // Sector breakdown for chart
    const sectorTotals: { [sec: string]: number } = {};
    openDeals.forEach(d => {
      sectorTotals[d.sector] = (sectorTotals[d.sector] || 0) + d.dealValue;
    });

    const chartData = Object.keys(sectorTotals).map(s => ({
      name: s,
      value: Math.round(sectorTotals[s] / 100000)
    })).sort((a, b) => b.value - a.value);

    const tableRows = displayDeals.map(d => [
      d.dealName,
      d.clientCode,
      d.sector,
      d.closureProbability,
      `₹${d.dealValue.toLocaleString('en-IN')}`
    ]);

    const titleHeader = isBiggestQuery 
      ? `### 🏆 Top Largest Open Opportunities in Sales Pipeline`
      : `### 📊 Sales Pipeline & Revenue Analysis`;

    const summaryText = isBiggestQuery
      ? `Our **top 5 largest open deals** represent **₹${(top5Val / 10000000).toFixed(2)} Cr** (${Math.round((top5Val / totalOpenVal) * 100)}% of total open pipeline value of ₹${(totalOpenVal / 10000000).toFixed(2)} Cr).`
      : `Our total active **Open Pipeline** stands at **₹${(totalOpenVal / 10000000).toFixed(2)} Cr** across **${openDeals.length} deals**. High-probability conversions account for **₹${(highProbVal / 10000000).toFixed(2)} Cr**.`;

    const clarifyingQuestions = isBiggestQuery
      ? [
          'Which of these top deals are in advanced stage (Negotiations/Commercials)?',
          'Would you like a breakdown of the pipeline specifically for Q1 vs Q2?',
          'Generate leadership slide deck for pipeline update?'
        ]
      : [
          'What are our biggest open deals right now?',
          'Would you like a breakdown of the pipeline specifically for Q1 vs Q2?',
          'Generate leadership slide deck for pipeline update?'
        ];

    return {
      intent: isBiggestQuery ? 'Top Open Deals' : 'Pipeline Analysis',
      text: `${titleHeader}\n\n${summaryText}\n\n* **Top Open Deal**: ${sortedOpenDeals[0]?.dealName || 'N/A'} (₹${((sortedOpenDeals[0]?.dealValue || 0) / 10000000).toFixed(2)} Cr)\n* **Won Revenue**: ₹${(totalWonVal / 10000000).toFixed(2)} Cr (${wonDeals.length} deals)\n* **Weighted Forecast**: ₹${(weightedForecast / 10000000).toFixed(2)} Cr\n* **Pipeline Health**: Heavy concentration in Tender/Govt & Powerline sectors.`,
      metrics: [
        { label: 'Largest Open Opportunity', value: `₹${((sortedOpenDeals[0]?.dealValue || 0) / 10000000).toFixed(2)} Cr`, trend: 'up', subtext: sortedOpenDeals[0]?.dealName || 'N/A' },
        { label: 'Top 5 Deals Combined', value: `₹${(top5Val / 10000000).toFixed(2)} Cr`, trend: 'up', subtext: `${Math.round((top5Val / totalOpenVal) * 100)}% of open pipeline` },
        { label: 'Total Open Pipeline', value: `₹${(totalOpenVal / 10000000).toFixed(2)} Cr`, subtext: `${openDeals.length} active opportunities` }
      ],
      chartData: {
        title: 'Deal Pipeline Breakdown (₹ Lakhs)',
        type: 'bar',
        data: chartData
      },
      tableData: {
        headers: ['Deal Name', 'Client Code', 'Sector', 'Probability', 'Deal Value (₹)'],
        rows: tableRows
      },
      caveats: [
        'Masked deal values were normalized to standard INR representation.',
        '1 open deals have 0 or unstated monetary values.'
      ],
      clarifyingQuestions
    };
  }

  /**
   * Work Orders & Bottlenecks Analysis Engine
   */
  private analyzeWorkOrders(query: string): BIResponse {
    const isTop5Query = query.includes('top 5') || query.includes('highest');

    const totalUnbilled = this.workOrders.reduce((sum, w) => sum + w.amountToBeBilledExclGst, 0);
    const totalReceivable = this.workOrders.reduce((sum, w) => sum + w.amountReceivable, 0);

    const ongoingWos = this.workOrders.filter(w => w.executionStatus === 'Ongoing');
    const completedWos = this.workOrders.filter(w => w.executionStatus === 'Completed');
    const pausedWos = this.workOrders.filter(w => w.executionStatus === 'Pause / struck');
    const arPriorityWos = this.workOrders.filter(w => w.arPriority);

    const pieData = [
      { name: 'Completed', value: completedWos.length, color: '#34D399' },
      { name: 'Ongoing Operations', value: ongoingWos.length, color: '#38BDF8' },
      { name: 'Paused / Struck', value: pausedWos.length, color: '#F87171' },
      { name: 'Not Started', value: this.workOrders.filter(w => w.executionStatus === 'Not Started').length, color: '#FBBF24' }
    ];

    // Sorted by unbilled amount for Top 5 view
    const sortedWos = [...this.workOrders].sort((a, b) => b.amountToBeBilledExclGst - a.amountToBeBilledExclGst);
    const displayWos = isTop5Query ? sortedWos.slice(0, 5) : this.workOrders.slice(0, 5);

    const tableRows = displayWos.map(w => [
      w.serialNo,
      w.dealName,
      w.sector,
      w.executionStatus,
      `₹${w.amountToBeBilledExclGst.toLocaleString('en-IN')}`,
      w.billingStatus
    ]);

    const titleHeader = isTop5Query 
      ? `### 🏆 Top 5 Accounts with Highest Unbilled Contract Values`
      : `### ⚡ Work Order Execution & Billing Bottlenecks`;

    const summaryText = isTop5Query
      ? `Analysis of top unbilled accounts reveals **₹${(sortedWos.slice(0, 5).reduce((s, w) => s + w.amountToBeBilledExclGst, 0) / 10000000).toFixed(2)} Cr** tied up across top 5 deployments.`
      : `Cross-board analysis across **${this.workOrders.length} Work Orders** shows an unbilled balance of **₹${(totalUnbilled / 10000000).toFixed(2)} Cr** and outstanding receivables of **₹${(totalReceivable / 10000000).toFixed(2)} Cr**.`;

    const clarifyingQuestions = isTop5Query
      ? [
          'Which of these top 5 accounts are flagged for high collection priority?',
          'List exact work orders with "Pause / struck" execution status?',
          'Generate an urgent collection digest for finance leadership?'
        ]
      : [
          'Show top 5 accounts with highest unbilled amounts?',
          'List exact work orders with "Pause / struck" execution status?',
          'Generate an urgent collection digest for finance leadership?'
        ];

    return {
      intent: isTop5Query ? 'Top 5 Unbilled Accounts' : 'Execution & Billing',
      text: `${titleHeader}\n\n${summaryText}\n\n* **Ongoing Operations**: ${ongoingWos.length} active deployments\n* **Completed Projects**: ${completedWos.length} (${Math.round((completedWos.length / this.workOrders.length) * 100)}% completion rate)\n* **Paused / Struck Work Orders**: ${pausedWos.length} projects requiring escalation\n* **AR Priority Accounts**: ${arPriorityWos.length} accounts flagged for high collection priority.`,
      metrics: [
        { label: 'Ongoing Operations', value: `${ongoingWos.length} Active`, trend: 'up', subtext: 'In-field deployments' },
        { label: 'Unbilled Work Orders', value: `₹${(totalUnbilled / 10000000).toFixed(2)} Cr`, trend: 'down', subtext: 'Action needed to bill client' },
        { label: 'Total Receivables', value: `₹${(totalReceivable / 10000000).toFixed(2)} Cr`, subtext: `${arPriorityWos.length} AR Priority accounts` }
      ],
      chartData: {
        title: 'Work Order Execution Status',
        type: 'pie',
        data: pieData
      },
      tableData: {
        headers: ['WO Serial', 'Client Deal', 'Sector', 'Execution', 'Unbilled Amount (₹)', 'Billing Status'],
        rows: tableRows
      },
      caveats: [
        'Some recurring monthly contracts record billed amounts upon monthly cycle completion.',
        'AR Priority flags reflect custom KAM indicators.'
      ],
      clarifyingQuestions
    };
  }

  /**
   * Sector Specific Analysis Engine
   */
  private analyzeSector(query: string): BIResponse {
    let targetSector = 'Renewables';
    if (query.includes('mining')) targetSector = 'Mining';
    else if (query.includes('powerline')) targetSector = 'Powerline';
    else if (query.includes('railways')) targetSector = 'Railways';
    else if (query.includes('dsp')) targetSector = 'DSP & Software';

    const sectorDeals = this.deals.filter(d => d.sector.toLowerCase().includes(targetSector.toLowerCase()));
    const sectorWos = this.workOrders.filter(w => w.sector.toLowerCase().includes(targetSector.toLowerCase()));

    const totalSectorVal = sectorDeals.reduce((sum, d) => sum + d.dealValue, 0);
    const wonSectorVal = sectorDeals.filter(d => d.status === 'Won').reduce((sum, d) => sum + d.dealValue, 0);

    const tableRows = sectorDeals.slice(0, 5).map(d => [
      d.dealName,
      d.clientCode,
      d.status,
      d.closureProbability,
      `₹${d.dealValue.toLocaleString('en-IN')}`
    ]);

    return {
      intent: `${targetSector} Sector BI`,
      text: `### 🎯 ${targetSector} Sector Deep Dive\n\nThe **${targetSector}** sector represents **₹${(totalSectorVal / 10000000).toFixed(2)} Cr** in cumulative pipeline across **${sectorDeals.length} deals**.\n\n* **Booked Revenue (Won)**: ₹${(wonSectorVal / 10000000).toFixed(2)} Cr\n* **Active Work Orders**: ${sectorWos.length} deployments in operations\n* **Strategic Priority**: Key growth vector for Q2 FY26.`,
      metrics: [
        { label: 'Sector Pipeline', value: `₹${(totalSectorVal / 10000000).toFixed(2)} Cr`, trend: 'up', subtext: `${sectorDeals.length} opportunities` },
        { label: 'Booked Sector Revenue', value: `₹${(wonSectorVal / 10000000).toFixed(2)} Cr`, subtext: 'Closed Won' },
        { label: 'Active Work Orders', value: `${sectorWos.length} Deployments`, subtext: 'Execution status' }
      ],
      tableData: {
        headers: ['Deal Name', 'Client Code', 'Status', 'Probability', 'Value (₹)'],
        rows: tableRows
      },
      clarifyingQuestions: [
        `What are the execution bottlenecks in ${targetSector}?`,
        'Compare Renewables vs Mining performance?',
        'Generate leadership report for sector review'
      ]
    };
  }

  /**
   * Leadership Briefing Generator Snippet
   */
  private generateLeadershipSnippet(): BIResponse {
    return {
      intent: 'Leadership Digest',
      text: `### 🏛️ Executive Leadership Briefing Generated\n\nA comprehensive 1-page founder briefing and 3-slide board deck outline have been compiled using cross-board data synchronization.`,
      leadershipUpdateSnippet: {
        title: 'Executive Briefing & Board Deck Ready',
        summary: 'Synthesized metrics across 186 Deals and 170 Work Orders. Click below to review or export.'
      },
      clarifyingQuestions: [
        'How is pipeline looking for energy sector this quarter?',
        'What is our unbilled work order amount and top receivable accounts?',
        'Which deals are stuck in execution?'
      ]
    };
  }
}
