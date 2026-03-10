import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/app'

export type CompanyBusinessType = 'B2B' | 'B2C' | 'B2B_B2C' | 'OTHER'

export type CompanyServiceType =
  | 'COMMERCE'
  | 'SAAS'
  | 'COMMUNITY'
  | 'CONTENT'
  | 'OTHER'

export type CompanyPolicy = {
  id: string
  companyName: string
  businessType: CompanyBusinessType
  serviceType: CompanyServiceType
  hasPaidService: boolean
  termsTextKo?: string
  termsTextEn?: string
  privacyTextKo?: string
  privacyTextEn?: string
  notes?: string
}

const COLLECTION_NAME = 'company_policies'

export const CompanyPolicyRepository = {
  async getAll(): Promise<CompanyPolicy[]> {
    const snap = await getDocs(collection(db, COLLECTION_NAME))
    return snap.docs.map((d) => {
      const data = d.data() as Omit<CompanyPolicy, 'id'> & {
        updatedAt?: Timestamp
      }
      return {
        id: d.id,
        companyName: data.companyName,
        businessType: data.businessType,
        serviceType: data.serviceType,
        hasPaidService: data.hasPaidService,
        termsTextKo: data.termsTextKo,
        termsTextEn: data.termsTextEn,
        privacyTextKo: data.privacyTextKo,
        privacyTextEn: data.privacyTextEn,
        notes: data.notes,
      }
    })
  },

  async upsert(item: CompanyPolicy): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, item.id)
    await setDoc(
      ref,
      {
        companyName: item.companyName,
        businessType: item.businessType,
        serviceType: item.serviceType,
        hasPaidService: item.hasPaidService,
        termsTextKo: item.termsTextKo ?? null,
        termsTextEn: item.termsTextEn ?? null,
        privacyTextKo: item.privacyTextKo ?? null,
        privacyTextEn: item.privacyTextEn ?? null,
        notes: item.notes ?? null,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    )
  },

  async delete(id: string): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, id)
    await deleteDoc(ref)
  },
}

