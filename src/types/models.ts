export interface StoredSecretEntry {
  accountName: string;
  algorithm: string;
  authType: string;
  counter: number;
  createdAt: string;
  digits: number;
  entryId: string;
  id: number;
  issuer: string;
  period: number;
  scannedAt: number;
  secret: string;
  synchronizedAt: number;
  updatedAt: string;
  userId: number;
}
