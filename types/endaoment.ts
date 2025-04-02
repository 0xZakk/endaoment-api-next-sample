export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type FundAdvisor = {
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
};

// TODO: Review and merge these types - there are multiple Fund type definitions 
export type Fund = {
  id: string;
  name: string;
  balance: string;
};

export interface DonorAdvisedFund {
  id: string;
  name: string;
  description: string;
  createdAtUtc: string;
  usdcBalance: string;
  category: string;
}

export type WireInstructions = {
  bankName: string;
  bankAddress: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  referenceNumber: string;
  amount: string;
};

export type DonorAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type DonorIdentity = {
  firstName: string;
  lastName: string;
  email: string;
  address: DonorAddress;
};

export type WireDonationRequest = {
  amount: string;
  donor: DonorIdentity;
  fundId: string;
};

export interface OAuthState {
  redirectUrl: string;
  timestamp: number;
}

export interface OAuthStateRecord {
  state: OAuthState;
  id: string;
}

export interface SaveOAuthStateResult {
  id: string;
}

export interface GetOAuthStateResult {
  state: OAuthState | null;
}

export type Organization = {
  id: string;
  ein: string;
  name: string;
  description: string;
  address: string;
  score: number;
  logo?: string;
};

// TODO: Review and merge these types - there are multiple Fund type definitions 