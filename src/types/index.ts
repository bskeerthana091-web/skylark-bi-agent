export interface RawDeal {
  'Deal Name'?: string;
  'Owner code'?: string;
  'Client Code'?: string;
  'Deal Status'?: string;
  'Close Date (A)'?: string;
  'Closure Probability'?: string;
  'Masked Deal value'?: string | number;
  'Tentative Close Date'?: string;
  'Deal Stage'?: string;
  'Product deal'?: string;
  'Sector/service'?: string;
  'Created Date'?: string;
  [key: string]: any;
}

export interface CleanDeal {
  id: string;
  dealName: string;
  ownerCode: string;
  clientCode: string;
  status: 'Won' | 'Open' | 'Dead' | 'On Hold' | 'Unknown';
  closeDate: string | null;
  tentativeCloseDate: string | null;
  createdDate: string | null;
  closureProbability: 'High' | 'Medium' | 'Low' | 'Unspecified';
  dealValue: number;
  dealStage: string;
  productDeal: string;
  sector: string;
  quarter: string;
  hasCaveats: boolean;
  caveatDetails: string[];
}

export interface RawWorkOrder {
  'Deal name masked'?: string;
  'Customer Name Code'?: string;
  'Serial #'?: string;
  'Nature of Work'?: string;
  'Last executed month of recurring project'?: string;
  'Execution Status'?: string;
  'Data Delivery Date'?: string;
  'Date of PO/LOI'?: string;
  'Document Type'?: string;
  'Probable Start Date'?: string;
  'Probable End Date'?: string;
  'BD/KAM Personnel code'?: string;
  'Sector'?: string;
  'Type of Work'?: string;
  'Is any Skylark software platform part of the client deliverables in this deal?'?: string;
  'Last invoice date'?: string;
  'latest invoice no.'?: string;
  'Amount in Rupees (Excl of GST) (Masked)'?: string | number;
  'Amount in Rupees (Incl of GST) (Masked)'?: string | number;
  'Billed Value in Rupees (Excl of GST.) (Masked)'?: string | number;
  'Billed Value in Rupees (Incl of GST.) (Masked)'?: string | number;
  'Collected Amount in Rupees (Incl of GST.) (Masked)'?: string | number;
  'Amount to be billed in Rs. (Exl. of GST) (Masked)'?: string | number;
  'Amount to be billed in Rs. (Incl. of GST) (Masked)'?: string | number;
  'Amount Receivable (Masked)'?: string | number;
  'AR Priority account'?: string;
  'WO Status (billed)'?: string;
  'Billing Status'?: string;
  'Collection status'?: string;
  [key: string]: any;
}

export interface CleanWorkOrder {
  id: string;
  dealName: string;
  customerCode: string;
  serialNo: string;
  natureOfWork: string;
  executionStatus: 'Completed' | 'Ongoing' | 'Not Started' | 'Pause / struck' | 'Partial Completed' | 'Unknown';
  startDate: string | null;
  endDate: string | null;
  poDate: string | null;
  ownerCode: string;
  sector: string;
  typeOfWork: string;
  skylarkSoftware: string;
  amountExclGst: number;
  amountInclGst: number;
  billedValueExclGst: number;
  billedValueInclGst: number;
  collectedAmountInclGst: number;
  amountToBeBilledExclGst: number;
  amountReceivable: number;
  arPriority: boolean;
  woStatusBilled: string;
  billingStatus: 'Fully Billed' | 'Partially Billed' | 'Not billed yet' | 'Not Billable' | 'Unknown';
  hasCaveats: boolean;
  caveatDetails: string[];
}

export interface DataHygieneAudit {
  totalDeals: number;
  totalWorkOrders: number;
  qualityScore: number;
  dealsCaveatsCount: number;
  workOrdersCaveatsCount: number;
  issuesList: {
    category: 'Missing Value' | 'Format Mismatch' | 'Masked Amount' | 'Unbilled Work Order' | 'Missing Stage';
    description: string;
    affectedRecord: string;
    severity: 'high' | 'medium' | 'low';
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  intent?: string;
  metrics?: {
    label: string;
    value: string;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }[];
  chartData?: {
    type: 'bar' | 'pie' | 'line' | 'funnel';
    title: string;
    data: { name: string; value: number; secondary?: number; color?: string }[];
  };
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  clarifyingQuestions?: string[];
  caveats?: string[];
  leadershipUpdateSnippet?: {
    title: string;
    summary: string;
  };
}

export interface MondayConfig {
  apiToken: string;
  dealsBoardId: string;
  workOrdersBoardId: string;
  isConnected: boolean;
  isDemoMode: boolean;
}

export interface LeadershipUpdate {
  generatedAt: string;
  quarterPeriod: string;
  founderBriefing: {
    executiveSummary: string;
    keyWins: string[];
    topRisks: string[];
    strategicActionItems: string[];
  };
  slideDeck: {
    slideNumber: number;
    title: string;
    bullets: string[];
    metricsText: string;
  }[];
  emailDigest: string;
}
