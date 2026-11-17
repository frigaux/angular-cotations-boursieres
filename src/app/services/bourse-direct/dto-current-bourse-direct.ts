export interface DtoCurrentBourseDirect {
  Date: number; // Unix epoch time in second
  OpenPrice: number;
  ClosePrice: number;
  High: number;
  Low: number;
  Volume: number;
  TradeCount: number;
}
