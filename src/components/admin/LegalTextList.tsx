import { useEffect, useMemo, useState } from 'react'
import {
  LegalTextRepository,
  type LegalText,
  type LegalTextCategory,
} from '../../services/legalTextRepository'

type Draft = Omit<LegalText, 'id'> & { id?: string }

const emptyDraft: Draft = {
  id: undefined,
  category: 'TERMS_LAW',
  title: '',
  language: 'ko',
  content: '',
  tags: [],
}

export function LegalTextList() {
  const [items, setItems] = useState<LegalText[]>([])
  const [filterCategory, setFilterCategory] = useState<LegalTextCategory | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    void LegalTextRepository.getAll().then(setItems)
  }, [])

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (filterCategory !== 'ALL' && item.category !== filterCategory) return false
        if (!keyword.trim()) return true
        const k = keyword.toLowerCase()
        return (
          item.title.toLowerCase().includes(k) ||
          item.tags.some((t) => t.toLowerCase().includes(k))
        )
      }),
    [items, filterCategory, keyword],
  )

  const startCreate = () => {
    setEditingId(null)
    setDraft(emptyDraft)
  }

  const startEdit = (item: LegalText) => {
    setEditingId(item.id)
    setDraft({
      id: item.id,
      category: item.category,
      title: item.title,
      language: item.language,
      content: item.content,
      tags: item.tags,
    })
  }

  const handleSave = async () => {
    const id = draft.id && draft.id.trim() ? draft.id.trim() : `lt_${Date.now()}`
    const toSave: LegalText = {
      id,
      category: draft.category,
      title: draft.title.trim(),
      language: draft.language,
      content: draft.content,
      tags: draft.tags,
    }
    await LegalTextRepository.upsert(toSave)
    const next = await LegalTextRepository.getAll()
    setItems(next)
    setEditingId(null)
    setDraft(emptyDraft)
  }

  const handleDelete = async (id: string) => {
    await LegalTextRepository.delete(id)
    const next = await LegalTextRepository.getAll()
    setItems(next)
    if (editingId === id) {
      setEditingId(null)
      setDraft(emptyDraft)
    }
  }

  const tagString = draft.tags.join(', ')

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(
              (e.target.value as LegalTextCategory | 'ALL') ?? 'ALL',
            )
          }
        >
          <option value="ALL">전체 카테고리</option>
          <option value="TERMS_LAW">이용약관 관련</option>
          <option value="PRIVACY_LAW">개인정보 관련</option>
          <option value="OTHER">기타</option>
        </select>
        <input
          placeholder="제목/태그 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="button" onClick={startCreate}>
          새 텍스트
        </button>
      </div>

      <div className="admin-grid">
        <div className="admin-list">
          {filtered.length === 0 ? (
            <div className="empty-hint">
              등록된 법령 텍스트가 없습니다. 우측 폼에서 새 텍스트를 추가해 보세요.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>언어</th>
                  <th>태그</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.language}</td>
                    <td>{item.tags.join(', ')}</td>
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
          <h3>{editingId ? '법령 텍스트 수정' : '법령 텍스트 추가'}</h3>
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
            <span>카테고리</span>
            <select
              value={draft.category}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  category: e.target.value as LegalTextCategory,
                }))
              }
            >
              <option value="TERMS_LAW">이용약관 관련</option>
              <option value="PRIVACY_LAW">개인정보 관련</option>
              <option value="OTHER">기타</option>
            </select>
          </label>
          <label>
            <span>언어</span>
            <select
              value={draft.language}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  language: e.target.value as 'ko' | 'en',
                }))
              }
            >
              <option value="ko">한국어</option>
              <option value="en">영어</option>
            </select>
          </label>
          <label>
            <span>제목</span>
            <input
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </label>
          <label>
            <span>태그 (쉼표로 구분)</span>
            <input
              placeholder="membership, minors, liability"
              value={tagString}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                }))
              }
            />
          </label>
          <label>
            <span>내용</span>
            <textarea
              rows={8}
              value={draft.content}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, content: e.target.value }))
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

