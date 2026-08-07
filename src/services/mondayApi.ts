import { MondayConfig, CleanDeal, CleanWorkOrder } from '../types';
import { DataCleanerService } from './dataCleaner';
import { RAW_DEALS } from '../data/rawDeals';
import { RAW_WORK_ORDERS } from '../data/rawWorkOrders';

export class MondayApiService {
  private config: MondayConfig;

  constructor(config?: Partial<MondayConfig>) {
    this.config = {
      apiToken: config?.apiToken || '',
      dealsBoardId: config?.dealsBoardId || '',
      workOrdersBoardId: config?.workOrdersBoardId || '',
      isConnected: !!config?.apiToken,
      isDemoMode: !config?.apiToken
    };
  }

  public getConfig(): MondayConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<MondayConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.config.isDemoMode = !this.config.apiToken;
  }

  /**
   * Execute GraphQL query against monday.com API v2 via CORS-bypassing proxy endpoint
   * Tries both raw token and Bearer token headers for maximum compatibility
   */
  public async executeGraphQL(query: string, variables = {}): Promise<any> {
    if (this.config.isDemoMode || !this.config.apiToken) {
      throw new Error('Monday.com API Token not provided. Operating in Offline Demo Mode.');
    }

    const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? '/api/monday' 
      : 'https://api.monday.com/v2';

    const tokenStr = this.config.apiToken.trim();
    const authHeaders = [tokenStr, `Bearer ${tokenStr}`];

    let lastError: Error | null = null;

    for (const authHeader of authHeaders) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
            'API-Version': '2023-10'
          },
          body: JSON.stringify({ query, variables })
        });

        if (response.ok) {
          const result = await response.json();
          if (!result.errors || result.errors.length === 0) {
            return result.data;
          }
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('Monday.com API Token authorization failed.');
  }

  /**
   * Fetch Deals dataset (Live or Demo Fallback)
   */
  public async fetchDeals(): Promise<CleanDeal[]> {
    if (this.config.isDemoMode || !this.config.dealsBoardId) {
      return DataCleanerService.cleanDeals(RAW_DEALS);
    }

    try {
      const query = `
        query GetBoardItems($boardId: [ID!]) {
          boards(ids: $boardId) {
            name
            items_page {
              items {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
      `;
      const data = await this.executeGraphQL(query, { boardId: [this.config.dealsBoardId] });
      const items = data.boards[0]?.items_page?.items || [];

      if (items.length === 0) {
        return DataCleanerService.cleanDeals(RAW_DEALS);
      }

      const rawDeals = items.map((item: any) => {
        const deal: any = { 'Deal Name': item.name };
        item.column_values.forEach((cv: any) => {
          deal[cv.id] = cv.text;
        });
        return deal;
      });

      return DataCleanerService.cleanDeals(rawDeals);
    } catch (err) {
      console.warn('Failed to fetch live monday.com Deals, falling back to clean Skylark dataset:', err);
      return DataCleanerService.cleanDeals(RAW_DEALS);
    }
  }

  /**
   * Fetch Work Orders dataset (Live or Demo Fallback)
   */
  public async fetchWorkOrders(): Promise<CleanWorkOrder[]> {
    if (this.config.isDemoMode || !this.config.workOrdersBoardId) {
      return DataCleanerService.cleanWorkOrders(RAW_WORK_ORDERS);
    }

    try {
      const query = `
        query GetBoardItems($boardId: [ID!]) {
          boards(ids: $boardId) {
            name
            items_page {
              items {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
      `;
      const data = await this.executeGraphQL(query, { boardId: [this.config.workOrdersBoardId] });
      const items = data.boards[0]?.items_page?.items || [];

      if (items.length === 0) {
        return DataCleanerService.cleanWorkOrders(RAW_WORK_ORDERS);
      }

      const rawOrders = items.map((item: any) => {
        const wo: any = { 'Deal name masked': item.name };
        item.column_values.forEach((cv: any) => {
          wo[cv.id] = cv.text;
        });
        return wo;
      });

      return DataCleanerService.cleanWorkOrders(rawOrders);
    } catch (err) {
      console.warn('Failed to fetch live monday.com Work Orders, falling back to clean Skylark dataset:', err);
      return DataCleanerService.cleanWorkOrders(RAW_WORK_ORDERS);
    }
  }
}
