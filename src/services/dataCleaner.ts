import { RawDeal, CleanDeal, RawWorkOrder, CleanWorkOrder, DataHygieneAudit } from '../types';
import { RAW_DEALS } from '../data/rawDeals';
import { RAW_WORK_ORDERS } from '../data/rawWorkOrders';

export class DataCleanerService {
  /**
   * Helper to parse messy currency string / number
   */
  public static parseNumber(val: any): number {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    const str = String(val).replace(/,/g, '').trim();
    if (str.includes('#VALUE!') || str.includes('NA') || str === '-') return 0;
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Helper to normalize sector strings
   */
  public static normalizeSector(sector?: string): string {
    if (!sector || !sector.trim()) return 'Others';
    const s = sector.trim().toLowerCase();
    if (s.includes('mine') || s.includes('mining')) return 'Mining';
    if (s.includes('renew') || s.includes('solar') || s.includes('wind')) return 'Renewables';
    if (s.includes('power') || s.includes('powerline')) return 'Powerline';
    if (s.includes('rail') || s.includes('railway')) return 'Railways';
    if (s.includes('dsp') || s.includes('spectra') || s.includes('dmo')) return 'DSP & Software';
    if (s.includes('construct') || s.includes('building')) return 'Construction';
    if (s.includes('tender')) return 'Tender & Govt';
    return sector.trim();
  }

  /**
   * Helper to normalize date string to YYYY-MM-DD or return null
   */
  public static normalizeDate(dateStr?: string): string | null {
    if (!dateStr || dateStr.trim() === '' || dateStr.includes('#VALUE!')) return null;
    const trimmed = dateStr.trim();
    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    // Attempt parsing
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    return trimmed;
  }

  /**
   * Extract financial Quarter from date (e.g. FY25/26)
   */
  public static getQuarterFromDate(dateStr?: string | null): string {
    if (!dateStr) return 'Q4 FY25';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Q4 FY25';
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4 && month <= 6) return `Q1 FY${(year + 1).toString().slice(-2)}`;
    if (month >= 7 && month <= 9) return `Q2 FY${(year + 1).toString().slice(-2)}`;
    if (month >= 10 && month <= 12) return `Q3 FY${(year + 1).toString().slice(-2)}`;
    return `Q4 FY${year.toString().slice(-2)}`;
  }

  /**
   * Clean and normalize raw Deals dataset
   */
  public static cleanDeals(rawDeals: RawDeal[] = RAW_DEALS): CleanDeal[] {
    return rawDeals.map((item, index) => {
      const caveats: string[] = [];
      const dealName = (item['Deal Name'] || `Deal_${index + 1}`).trim();
      const rawVal = item['Masked Deal value'];
      const val = this.parseNumber(rawVal);
      
      if (!rawVal || rawVal === '' || rawVal === 0) {
        caveats.push('Missing masked deal monetary value');
      }

      const closeDate = this.normalizeDate(item['Close Date (A)']);
      const tentativeCloseDate = this.normalizeDate(item['Tentative Close Date']);
      const createdDate = this.normalizeDate(item['Created Date']);

      if (!tentativeCloseDate && !closeDate) {
        caveats.push('Missing close date timeline');
      }

      const statusRaw = (item['Deal Status'] || '').trim().toLowerCase();
      let status: CleanDeal['status'] = 'Open';
      if (statusRaw.includes('won')) status = 'Won';
      else if (statusRaw.includes('dead') || statusRaw.includes('lost')) status = 'Dead';
      else if (statusRaw.includes('hold')) status = 'On Hold';
      else if (statusRaw.includes('open')) status = 'Open';
      else {
        caveats.push('Unclear deal status');
        status = 'Unknown';
      }

      const closureProbRaw = (item['Closure Probability'] || '').trim().toLowerCase();
      let closureProbability: CleanDeal['closureProbability'] = 'Unspecified';
      if (closureProbRaw.includes('high')) closureProbability = 'High';
      else if (closureProbRaw.includes('medium')) closureProbability = 'Medium';
      else if (closureProbRaw.includes('low')) closureProbability = 'Low';

      const quarter = this.getQuarterFromDate(tentativeCloseDate || closeDate || createdDate);

      return {
        id: `DEAL-${index + 101}`,
        dealName,
        ownerCode: item['Owner code'] || 'UNASSIGNED',
        clientCode: item['Client Code'] || 'UNASSIGNED',
        status,
        closeDate,
        tentativeCloseDate,
        createdDate,
        closureProbability,
        dealValue: val,
        dealStage: item['Deal Stage'] || 'Unmapped Stage',
        productDeal: item['Product deal'] || 'Pure Service',
        sector: this.normalizeSector(item['Sector/service']),
        quarter,
        hasCaveats: caveats.length > 0,
        caveatDetails: caveats
      };
    });
  }

  /**
   * Clean and normalize raw Work Orders dataset
   */
  public static cleanWorkOrders(rawWorkOrders: RawWorkOrder[] = RAW_WORK_ORDERS): CleanWorkOrder[] {
    return rawWorkOrders.map((item, index) => {
      const caveats: string[] = [];
      const dealName = (item['Deal name masked'] || `WO_${index + 1}`).trim();
      const amountExclGst = this.parseNumber(item['Amount in Rupees (Excl of GST) (Masked)']);
      const amountInclGst = this.parseNumber(item['Amount in Rupees (Incl of GST) (Masked)']);
      const billedValueExclGst = this.parseNumber(item['Billed Value in Rupees (Excl of GST.) (Masked)']);
      const billedValueInclGst = this.parseNumber(item['Billed Value in Rupees (Incl of GST.) (Masked)']);
      const collectedAmountInclGst = this.parseNumber(item['Collected Amount in Rupees (Incl of GST.) (Masked)']);
      const amountToBeBilledExclGst = this.parseNumber(item['Amount to be billed in Rs. (Exl. of GST) (Masked)']);
      const amountReceivable = this.parseNumber(item['Amount Receivable (Masked)']);

      if (amountExclGst === 0 && amountInclGst === 0) {
        caveats.push('Zero or missing contract amount');
      }

      const execRaw = (item['Execution Status'] || '').trim().toLowerCase();
      let executionStatus: CleanWorkOrder['executionStatus'] = 'Unknown';
      if (execRaw.includes('completed')) executionStatus = 'Completed';
      else if (execRaw.includes('ongoing') || execRaw.includes('executed until')) executionStatus = 'Ongoing';
      else if (execRaw.includes('not started')) executionStatus = 'Not Started';
      else if (execRaw.includes('pause') || execRaw.includes('struck')) executionStatus = 'Pause / struck';
      else if (execRaw.includes('partial')) executionStatus = 'Partial Completed';

      const billingRaw = (item['Billing Status'] || item['WO Status (billed)'] || '').trim().toLowerCase();
      let billingStatus: CleanWorkOrder['billingStatus'] = 'Unknown';
      if (billingRaw.includes('fully') || billingRaw.includes('billed')) billingStatus = 'Fully Billed';
      else if (billingRaw.includes('partially')) billingStatus = 'Partially Billed';
      else if (billingRaw.includes('not billed') || billingRaw.includes('open')) billingStatus = 'Not billed yet';
      else if (billingRaw.includes('not billable')) billingStatus = 'Not Billable';

      if (billingStatus === 'Not billed yet' && amountToBeBilledExclGst > 0) {
        caveats.push(`Pending billing amount: ₹${amountToBeBilledExclGst.toLocaleString('en-IN')}`);
      }

      const arPriority = (item['AR Priority account'] || '').toLowerCase().includes('priority');

      return {
        id: item['Serial #'] || `WO-${index + 1}`,
        dealName,
        customerCode: item['Customer Name Code'] || 'UNASSIGNED',
        serialNo: item['Serial #'] || `WO-${index + 1}`,
        natureOfWork: item['Nature of Work'] || 'One time Project',
        executionStatus,
        startDate: this.normalizeDate(item['Probable Start Date']),
        endDate: this.normalizeDate(item['Probable End Date']),
        poDate: this.normalizeDate(item['Date of PO/LOI']),
        ownerCode: item['BD/KAM Personnel code'] || 'UNASSIGNED',
        sector: this.normalizeSector(item['Sector']),
        typeOfWork: item['Type of Work'] || 'Survey',
        skylarkSoftware: item['Is any Skylark software platform part of the client deliverables in this deal?'] || 'NONE',
        amountExclGst,
        amountInclGst,
        billedValueExclGst,
        billedValueInclGst,
        collectedAmountInclGst,
        amountToBeBilledExclGst,
        amountReceivable,
        arPriority,
        woStatusBilled: item['WO Status (billed)'] || 'Open',
        billingStatus,
        hasCaveats: caveats.length > 0,
        caveatDetails: caveats
      };
    });
  }

  /**
   * Audit data quality and generate hygiene score
   */
  public static auditDataQuality(deals: CleanDeal[], workOrders: CleanWorkOrder[]): DataHygieneAudit {
    const dealsCaveatsCount = deals.filter(d => d.hasCaveats).length;
    const workOrdersCaveatsCount = workOrders.filter(w => w.hasCaveats).length;
    const totalRecords = deals.length + workOrders.length;
    const cleanRecords = (deals.length - dealsCaveatsCount) + (workOrders.length - workOrdersCaveatsCount);

    const qualityScore = Math.round((cleanRecords / totalRecords) * 100);

    const issuesList: DataHygieneAudit['issuesList'] = [];

    deals.forEach(d => {
      if (d.dealValue === 0) {
        issuesList.push({
          category: 'Missing Value',
          description: `Deal "${d.dealName}" has empty or masked 0 deal value.`,
          affectedRecord: d.id,
          severity: 'medium'
        });
      }
      if (!d.closeDate && !d.tentativeCloseDate) {
        issuesList.push({
          category: 'Missing Stage',
          description: `Deal "${d.dealName}" is missing close date timeline.`,
          affectedRecord: d.id,
          severity: 'low'
        });
      }
    });

    workOrders.forEach(w => {
      if (w.amountToBeBilledExclGst > 500000 && w.billingStatus !== 'Fully Billed') {
        issuesList.push({
          category: 'Unbilled Work Order',
          description: `Work order "${w.dealName}" (${w.serialNo}) has ₹${(w.amountToBeBilledExclGst / 100000).toFixed(1)}L unbilled.`,
          affectedRecord: w.id,
          severity: 'high'
        });
      }
    });

    return {
      totalDeals: deals.length,
      totalWorkOrders: workOrders.length,
      qualityScore,
      dealsCaveatsCount,
      workOrdersCaveatsCount,
      issuesList
    };
  }
}
