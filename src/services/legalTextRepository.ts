import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/app'

export type LegalTextCategory = 'TERMS_LAW' | 'PRIVACY_LAW' | 'OTHER'

export type LegalText = {
  id: string
  category: LegalTextCategory
  title: string
  language: 'ko' | 'en'
  content: string
  tags: string[]
}

const COLLECTION_NAME = 'legal_texts'

export const LegalTextRepository = {
  async getAll(): Promise<LegalText[]> {
    const snap = await getDocs(collection(db, COLLECTION_NAME))
    return snap.docs.map((d) => {
      const data = d.data() as Omit<LegalText, 'id'> & {
        updatedAt?: Timestamp
        updatedBy?: string
      }
      return {
        id: d.id,
        category: data.category,
        title: data.title,
        language: data.language,
        content: data.content,
        tags: data.tags ?? [],
      }
    })
  },

  async upsert(item: LegalText): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, item.id)
    await setDoc(
      ref,
      {
        category: item.category,
        title: item.title,
        language: item.language,
        content: item.content,
        tags: item.tags,
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

