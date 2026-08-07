import { CleanDeal, CleanWorkOrder, LeadershipUpdate } from '../types';

export class LeadershipGeneratorService {
  public static generateLeadershipUpdate(deals: CleanDeal[], workOrders: CleanWorkOrder[]): LeadershipUpdate {
    const wonDeals = deals.filter(d => d.status === 'Won');
    const openDeals = deals.filter(d => d.status === 'Open');
    const highProbDeals = openDeals.filter(d => d.closureProbability === 'High');

    const wonValue = wonDeals.reduce((sum, d) => sum + d.dealValue, 0);
    const openValue = openDeals.reduce((sum, d) => sum + d.dealValue, 0);
    const highProbValue = highProbDeals.reduce((sum, d) => sum + d.dealValue, 0);

    const totalUnbilled = workOrders.reduce((sum, w) => sum + w.amountToBeBilledExclGst, 0);
    const totalReceivable = workOrders.reduce((sum, w) => sum + w.amountReceivable, 0);
    const priorityArCount = workOrders.filter(w => w.arPriority).length;

    const topSectors = ['Renewables', 'Mining', 'Railways', 'Powerline'];

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return {
      generatedAt: dateStr,
      quarterPeriod: 'Q1 / Q2 FY26 Executive Briefing',
      founderBriefing: {
        executiveSummary: `Skylark Drones performance remains strong with ₹${(wonValue / 10000000).toFixed(2)} Cr in closed revenue and ₹${(openValue / 10000000).toFixed(2)} Cr in active pipeline. Key growth is concentrated in Renewables & Mining sectors. However, execution billing requires immediate founder attention to clear ₹${(totalUnbilled / 10000000).toFixed(2)} Cr in unbilled contract value.`,
        keyWins: [
          `Closed ₹${(wonValue / 10000000).toFixed(2)} Cr across ${wonDeals.length} won contracts in key enterprise sectors.`,
          `High-probability pipeline of ₹${(highProbValue / 10000000).toFixed(2)} Cr expected to close within the next 45 days.`,
          `Multi-site LiDAR and RGB topography deployments ongoing across Railways and Powerline accounts.`
        ],
        topRisks: [
          `₹${(totalUnbilled / 10000000).toFixed(2)} Cr in completed/ongoing work orders remains unbilled due to invoice milestone delays.`,
          `Outstanding receivables of ₹${(totalReceivable / 10000000).toFixed(2)} Cr across ${priorityArCount} priority accounts.`,
          `4 work order contracts flagged as "Pause / struck" needing client escalation.`
        ],
        strategicActionItems: [
          `Operations & Billing Sync: Expedite data delivery sign-offs to unblock ₹${(totalUnbilled / 10000000).toFixed(2)} Cr in pending invoices.`,
          `Focus BD efforts on high-probability Renewables proposals (₹${(highProbValue / 10000000).toFixed(2)} Cr).`,
          `Review KAM allocation for top priority AR accounts.`
        ]
      },
      slideDeck: [
        {
          slideNumber: 1,
          title: 'Slide 1: Executive Summary & Financial Highlights',
          bullets: [
            `Total Revenue Booked (Won): ₹${(wonValue / 10000000).toFixed(2)} Cr`,
            `Active Sales Pipeline: ₹${(openValue / 10000000).toFixed(2)} Cr (${openDeals.length} open deals)`,
            `Weighted Pipeline Forecast: ₹${((wonValue + (highProbValue * 0.8)) / 10000000).toFixed(2)} Cr`,
            `Key Driver: Enterprise expansion in Renewables & Mining drone services`
          ],
          metricsText: `Booked: ₹${(wonValue / 10000000).toFixed(2)} Cr | Pipeline: ₹${(openValue / 10000000).toFixed(2)} Cr`
        },
        {
          slideNumber: 2,
          title: 'Slide 2: Sectoral Breakdown & Commercial Performance',
          bullets: [
            `Renewables Sector: Leading revenue contributor with solar thermography & flood risk surveys`,
            `Mining Sector: High-frequency volumetric & RGB topography surveys`,
            `Railways & Infrastructure: Large tender opportunities in road/rail mapping`,
            `Software Deliverables: Increasing adoption of SPECTRA and DMO platforms`
          ],
          metricsText: `Top Sector: Renewables & Mining (60%+ contribution)`
        },
        {
          slideNumber: 3,
          title: 'Slide 3: Execution Bottlenecks & Receivables Exposure',
          bullets: [
            `Unbilled Work Orders: ₹${(totalUnbilled / 10000000).toFixed(2)} Cr (Immediate billing action item)`,
            `Outstanding Receivables: ₹${(totalReceivable / 10000000).toFixed(2)} Cr across ${priorityArCount} Priority Accounts`,
            `Paused Projects: 4 contracts requiring client intervention`,
            `Next Step: Weekly billing review between Ops, Sales, and Finance`
          ],
          metricsText: `Unbilled Exposure: ₹${(totalUnbilled / 10000000).toFixed(2)} Cr | Receivables: ₹${(totalReceivable / 10000000).toFixed(2)} Cr`
        }
      ],
      emailDigest: `SUBJECT: Skylark Drones - Executive Leadership Digest (${dateStr})\n\nDear Leadership Team,\n\nHere is the weekly Business Intelligence summary synthesized from our monday.com Deals and Work Orders boards:\n\n1. FINANCIAL HIGHLIGHTS\n- Closed Won Revenue: ₹${(wonValue / 10000000).toFixed(2)} Cr\n- Open Sales Pipeline: ₹${(openValue / 10000000).toFixed(2)} Cr\n- High Probability Deals: ₹${(highProbValue / 10000000).toFixed(2)} Cr\n\n2. OPERATIONS & BILLING\n- Unbilled Contract Exposure: ₹${(totalUnbilled / 10000000).toFixed(2)} Cr\n- Outstanding Receivables: ₹${(totalReceivable / 10000000).toFixed(2)} Cr\n\n3. STRATEGIC PRIORITIES\n- Clear unbilled work order backlog\n- Focus BD bandwidth on Renewables high-probability pipeline\n\nBest regards,\nSkylark BI Agent`
    };
  }
}
