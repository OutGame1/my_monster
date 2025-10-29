import type { IWalletDocument } from '@/db/models/wallet.model'

export interface ISerializedWallet {
  _id: string
  ownerId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export default function walletSerializer (rawWallet: IWalletDocument): ISerializedWallet {
  return {
    _id: rawWallet._id.toString(),
    ownerId: rawWallet.ownerId.toString(),
    balance: rawWallet.balance,
    createdAt: rawWallet.createdAt.toISOString(),
    updatedAt: rawWallet.updatedAt.toISOString()
  }
}
