import { useEffect, useMemo, useState } from 'react'
import {
  CompanyPolicyRepository,
  type CompanyBusinessType,
  type CompanyPolicy,
  type CompanyServiceType,
} from '../../services/companyPolicyRepository'

type Draft = Omit<CompanyPolicy, 'id'> & { id?: string }

const emptyDraft: Draft = {
  id: undefined,
  companyName: '',
  businessType: 'B2C',
  serviceType: 'COMMERCE',
  hasPaidService: true,
  termsTextKo: '',
  termsTextEn: '',
  privacyTextKo: '',
  privacyTextEn: '',
  notes: '',
}

export function CompanyPolicyList() {
  const [items, setItems] = useState<CompanyPolicy[]>([])
  const [filterServiceType, setFilterServiceType] =
    useState<CompanyServiceType | 'ALL'>('ALL')
  const [filterBusinessType, setFilterBusinessType] =
    useState<CompanyBusinessType | 'ALL'>('ALL')
  const [filterPaid, setFilterPaid] = useState<'ALL' | 'PAID' | 'FREE'>('ALL')
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    void CompanyPolicyRepository.getAll().then(setItems)
  }, [])

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (
          filterServiceType !== 'ALL' &&
          item.serviceType !== filterServiceType
        ) {
          return false
        }
        if (
          filterBusinessType !== 'ALL' &&
          item.businessType !== filterBusinessType
        ) {
          return false
        }
        if (filterPaid === 'PAID' && !item.hasPaidService) return false
        if (filterPaid === 'FREE' && item.hasPaidService) return false
        return true
      }),
    [items, filterServiceType, filterBusinessType, filterPaid],
  )

  const startCreate = () => {
    setEditingId(null)
    setDraft(emptyDraft)
  }

  const startEdit = (item: CompanyPolicy) => {
    setEditingId(item.id)
    setDraft({
      id: item.id,
      companyName: item.companyName,
      businessType: item.businessType,
      serviceType: item.serviceType,
      hasPaidService: item.hasPaidService,
      termsTextKo: item.termsTextKo ?? '',
      termsTextEn: item.termsTextEn ?? '',
      privacyTextKo: item.privacyTextKo ?? '',
      privacyTextEn: item.privacyTextEn ?? '',
      notes: item.notes ?? '',
    })
  }

  const handleSave = async () => {
    const id = draft.id && draft.id.trim() ? draft.id.trim() : `cp_${Date.now()}`
    const toSave: CompanyPolicy = {
      id,
      companyName: draft.companyName.trim(),
      businessType: draft.businessType,
      serviceType: draft.serviceType,
      hasPaidService: draft.hasPaidService,
      termsTextKo: draft.termsTextKo?.trim() || undefined,
      termsTextEn: draft.termsTextEn?.trim() || undefined,
      privacyTextKo: draft.privacyTextKo?.trim() || undefined,
      privacyTextEn: draft.privacyTextEn?.trim() || undefined,
      notes: draft.notes?.trim() || undefined,
    }
    await CompanyPolicyRepository.upsert(toSave)
    const next = await CompanyPolicyRepository.getAll()
    setItems(next)
    setEditingId(null)
    setDraft(emptyDraft)
  }

  const handleDelete = async (id: string) => {
    await CompanyPolicyRepository.delete(id)
    const next = await CompanyPolicyRepository.getAll()
    setItems(next)
    if (editingId === id) {
      setEditingId(null)
      setDraft(emptyDraft)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <select
          value={filterServiceType}
          onChange={(e) =>
            setFilterServiceType(
              (e.target.value as CompanyServiceType | 'ALL') ?? 'ALL',
            )
          }
        >
          <option value="ALL">전체 업종</option>
          <option value="COMMERCE">커머스</option>
          <option value="SAAS">SaaS</option>
          <option value="COMMUNITY">커뮤니티</option>
          <option value="CONTENT">콘텐츠</option>
          <option value="OTHER">기타</option>
        </select>
        <select
          value={filterBusinessType}
          onChange={(e) =>
            setFilterBusinessType(
              (e.target.value as CompanyBusinessType | 'ALL') ?? 'ALL',
            )
          }
        >
          <option value="ALL">전체 사업 유형</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
          <option value="B2B_B2C">B2B + B2C</option>
          <option value="OTHER">기타</option>
        </select>
        <select
          value={filterPaid}
          onChange={(e) =>
            setFilterPaid(e.target.value as 'ALL' | 'PAID' | 'FREE')
          }
        >
          <option value="ALL">유료/무료 전체</option>
          <option value="PAID">유료 서비스 포함</option>
          <option value="FREE">무료만</option>
        </select>
        <button type="button" onClick={startCreate}>
          새 사례
        </button>
      </div>

      <div className="admin-grid">
        <div className="admin-list">
          {filtered.length === 0 ? (
            <div className="empty-hint">
              저장된 회사 사례가 없습니다. 우측 폼에서 새 사례를 추가해 보세요.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>회사명</th>
                  <th>업종</th>
                  <th>사업 유형</th>
                  <th>유료 여부</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.companyName}</td>
                    <td>{item.serviceType}</td>
                    <td>{item.businessType}</td>
                    <td>{item.hasPaidService ? '유료' : '무료'}</td>
                    <td>
                      <button type="button" onClick={() => startEdit(item)}>
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-editor">
          <h3>{editingId ? '회사 사례 수정' : '회사 사례 추가'}</h3>
          <label>
            <span>ID (선택)</span>
            <input
              placeholder="비워두면 자동 생성"
              value={draft.id ?? ''}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  id: e.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>회사명</span>
            <input
              value={draft.companyName}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>사업 유형</span>
            <select
              value={draft.businessType}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  businessType: e.target.value as CompanyBusinessType,
                }))
              }
            >
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
              <option value="B2B_B2C">B2B + B2C</option>
              <option value="OTHER">기타</option>
            </select>
          </label>
          <label>
            <span>업종</span>
            <select
              value={draft.serviceType}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  serviceType: e.target.value as CompanyServiceType,
                }))
              }
            >
              <option value="COMMERCE">커머스</option>
              <option value="SAAS">SaaS</option>
              <option value="COMMUNITY">커뮤니티</option>
              <option value="CONTENT">콘텐츠</option>
              <option value="OTHER">기타</option>
            </select>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={draft.hasPaidService}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  hasPaidService: e.target.checked,
                }))
              }
            />
            <span>유료 서비스/상품 포함</span>
          </label>
          <label>
            <span>이용약관 (KO)</span>
            <textarea
              rows={4}
              value={draft.termsTextKo}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  termsTextKo: e.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>이용약관 (EN)</span>
            <textarea
              rows={4}
              value={draft.termsTextEn}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  termsTextEn: e.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>개인정보 처리방침 (KO)</span>
            <textarea
              rows={4}
              value={draft.privacyTextKo}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  privacyTextKo: e.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>개인정보 처리방침 (EN)</span>
            <textarea
              rows={4}
              value={draft.privacyTextEn}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  privacyTextEn: e.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>메모</span>
            <textarea
              rows={3}
              value={draft.notes}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          </label>
          <button type="button" onClick={() => void handleSave()}>
            {editingId ? '수정 저장' : '추가'}
          </button>
        </div>
      </div>
    </div>
  )
}

