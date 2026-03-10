import '../App.css'
import { LegalTextList } from '../components/admin/LegalTextList'
import { CompanyPolicyList } from '../components/admin/CompanyPolicyList'

export function AdminPage() {
  return (
    <main className="app-main">
      <section className="form-column">
        <h2>법령 텍스트 관리</h2>
        <p className="section-description">
          이용약관법, 개인정보 보호법 등에서 자주 사용하는 표준 문구 블록을 등록하고 수정합니다.
        </p>
        <LegalTextList />
      </section>
      <section className="preview-column">
        <h2>회사별 약관/정책 사례</h2>
        <p className="section-description">
          다양한 서비스의 이용약관과 개인정보 처리방침 사례를 저장해, 생성기의 참고 프로파일로 활용합니다.
        </p>
        <CompanyPolicyList />
      </section>
    </main>
  )
}

