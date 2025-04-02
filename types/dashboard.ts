export type ActivityItem = {
  id: string;
  type: string;
  amount: string;
  date: string;
  occurredAtUtc: string;
  usdcAmount: string;
};

export type TransferItem = {
  id: string;
  type: string;
  amount: string;
  status: string;
  date: string;
  createdAtUtc: string;
  requestedAmount: number;
  destinationOrg?: {
    name: string;
  };
  destinationSubproject?: {
    name: string;
  };
}; 