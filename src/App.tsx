import './App.css'
import { generateTerms } from './lib/generateTerms'
import { generatePrivacy } from './lib/generatePrivacy'

import { useState } from 'react'

type BusinessType = 'B2B' | 'B2C' | 'B2B_B2C' | 'OTHER'

type ServiceAccess = {
  browseWithoutLogin: boolean
  guestPurchase: boolean
  boardReadWrite: boolean
}

type PaymentOptions = {
  hasPaidService: boolean
  card: boolean
  bankTransfer: boolean
  easyPay: boolean
  subscription: boolean
}

type PrivacyOptions = {
  collectsName: boolean
  collectsPhone: boolean
  collectsEmail: boolean
  collectsAddress: boolean
  thirdPartyProvision: boolean
  outsourcing: boolean
  overseasTransfer: boolean
  retentionPolicy: 'NORMAL' | 'LONG' | 'CUSTOM'
}

type LanguageOptions = {
  ko: boolean
  en: boolean
}

type CompanyInfo = {
  companyName: string
  representativeName: string
  registrationNumber: string
  address: string
  contactNumber: string
  contactEmail: string
  serviceName: string
  platformType: 'WEB' | 'APP' | 'WEB_APP' | 'OTHER'
}

type ConfigState = {
  company: CompanyInfo
  businessType: BusinessType
  businessTypeOther: string
  serviceAccess: ServiceAccess
  payment: PaymentOptions
  privacy: PrivacyOptions
  languages: LanguageOptions
}

const defaultConfig: ConfigState = {
  company: {
    companyName: '',
    representativeName: '',
    registrationNumber: '',
    address: '',
    contactNumber: '',
    contactEmail: '',
    serviceName: '',
    platformType: 'WEB',
  },
  businessType: 'B2C',
  businessTypeOther: '',
  serviceAccess: {
    browseWithoutLogin: true,
    guestPurchase: false,
    boardReadWrite: false,
  },
  payment: {
    hasPaidService: true,
    card: true,
    bankTransfer: false,
    easyPay: true,
    subscription: false,
  },
  privacy: {
    collectsName: true,
    collectsPhone: true,
    collectsEmail: true,
    collectsAddress: false,
    thirdPartyProvision: true,
    outsourcing: true,
    overseasTransfer: false,
    retentionPolicy: 'NORMAL',
  },
  languages: {
    ko: true,
    en: false,
  },
}

function App() {
  const [config, setConfig] = useState<ConfigState>(defaultConfig)
  const [selectedDoc, setSelectedDoc] = useState<'terms' | 'privacy'>('terms')
  const [selectedLang, setSelectedLang] = useState<'ko' | 'en'>('ko')

  const updateCompany = (patch: Partial<CompanyInfo>) => {
    setConfig((prev) => ({ ...prev, company: { ...prev.company, ...patch } }))
  }

  const updateServiceAccess = (patch: Partial<ServiceAccess>) => {
    setConfig((prev) => ({
      ...prev,
      serviceAccess: { ...prev.serviceAccess, ...patch },
    }))
  }

  const updatePayment = (patch: Partial<PaymentOptions>) => {
    setConfig((prev) => ({
      ...prev,
      payment: { ...prev.payment, ...patch },
    }))
  }

  const updatePrivacy = (patch: Partial<PrivacyOptions>) => {
    setConfig((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...patch },
    }))
  }

  const updateLanguages = (patch: Partial<LanguageOptions>) => {
    setConfig((prev) => ({
      ...prev,
      languages: { ...prev.languages, ...patch },
    }))
  }

  const terms = generateTerms({
    languageKo: config.languages.ko,
    languageEn: config.languages.en,
    businessType: config.businessType,
    hasPaidService: config.payment.hasPaidService,
    context: {
      companyName: config.company.companyName || '회사명',
      serviceName: config.company.serviceName || '서비스명',
    },
  })

  const privacy = generatePrivacy({
    languageKo: config.languages.ko,
    languageEn: config.languages.en,
    collectsAddress: config.privacy.collectsAddress,
    thirdPartyProvision: config.privacy.thirdPartyProvision,
    outsourcing: config.privacy.outsourcing,
    overseasTransfer: config.privacy.overseasTransfer,
    context: {
      companyName: config.company.companyName || '회사명',
      serviceName: config.company.serviceName || '서비스명',
    },
  })

  const currentText =
    selectedDoc === 'terms'
      ? selectedLang === 'ko'
        ? terms.ko
        : terms.en
      : selectedLang === 'ko'
        ? privacy.ko
        : privacy.en

  const handleCopy = async () => {
    if (!currentText) return
    try {
      await navigator.clipboard.writeText(currentText)
    } catch {
      // ignore copy failures
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>AutoPolicy</h1>
          <p className="app-subtitle">
            회사 정보와 옵션을 선택해서 이용약관 / 개인정보 처리방침을 자동 생성하세요.
          </p>
        </div>
        <a
          href="https://github.com/KANGPUNGYUN/AutoPolicy"
          target="_blank"
          rel="noreferrer"
          className="header-link"
        >
          GitHub
        </a>
      </header>

      <main className="app-main">
        <section className="form-column">
          <h2>1. 회사 기본 정보</h2>
          <div className="form-grid">
            <label>
              <span>회사명</span>
              <input
                value={config.company.companyName}
                onChange={(e) => updateCompany({ companyName: e.target.value })}
              />
            </label>
            <label>
              <span>서비스명</span>
              <input
                value={config.company.serviceName}
                onChange={(e) => updateCompany({ serviceName: e.target.value })}
              />
            </label>
            <label>
              <span>대표자명</span>
              <input
                value={config.company.representativeName}
                onChange={(e) =>
                  updateCompany({ representativeName: e.target.value })
                }
              />
            </label>
            <label>
              <span>사업자등록번호</span>
              <input
                value={config.company.registrationNumber}
                onChange={(e) =>
                  updateCompany({ registrationNumber: e.target.value })
                }
              />
            </label>
            <label className="full-width">
              <span>주소</span>
              <input
                value={config.company.address}
                onChange={(e) => updateCompany({ address: e.target.value })}
              />
            </label>
            <label>
              <span>대표 전화번호</span>
              <input
                value={config.company.contactNumber}
                onChange={(e) =>
                  updateCompany({ contactNumber: e.target.value })
                }
              />
            </label>
            <label>
              <span>대표 이메일</span>
              <input
                value={config.company.contactEmail}
                onChange={(e) =>
                  updateCompany({ contactEmail: e.target.value })
                }
              />
            </label>
          </div>

          <h2>2. 사업/서비스 유형</h2>
          <div className="form-grid">
            <label>
              <span>사업 유형</span>
              <select
                value={config.businessType}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    businessType: e.target.value as BusinessType,
                  }))
                }
              >
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
                <option value="B2B_B2C">B2B + B2C</option>
                <option value="OTHER">기타</option>
              </select>
            </label>
            {config.businessType === 'OTHER' && (
              <label>
                <span>기타 설명</span>
                <input
                  value={config.businessTypeOther}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      businessTypeOther: e.target.value,
                    }))
                  }
                />
              </label>
            )}

            <label>
              <span>플랫폼 유형</span>
              <select
                value={config.company.platformType}
                onChange={(e) =>
                  updateCompany({
                    platformType: e.target.value as CompanyInfo['platformType'],
                  })
                }
              >
                <option value="WEB">웹 서비스</option>
                <option value="APP">모바일 앱</option>
                <option value="WEB_APP">웹 + 앱</option>
                <option value="OTHER">기타</option>
              </select>
            </label>
          </div>

          <h2>3. 회원/비회원 서비스 및 결제</h2>
          <fieldset className="fieldset">
            <legend>회원/비회원 서비스</legend>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.serviceAccess.browseWithoutLogin}
                onChange={(e) =>
                  updateServiceAccess({ browseWithoutLogin: e.target.checked })
                }
              />
              <span>비회원도 상품/콘텐츠 열람 가능</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.serviceAccess.guestPurchase}
                onChange={(e) =>
                  updateServiceAccess({ guestPurchase: e.target.checked })
                }
              />
              <span>비회원 구매 허용</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.serviceAccess.boardReadWrite}
                onChange={(e) =>
                  updateServiceAccess({ boardReadWrite: e.target.checked })
                }
              />
              <span>게시판/리뷰 작성 기능 제공</span>
            </label>
          </fieldset>

          <fieldset className="fieldset">
            <legend>결제 방식</legend>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.payment.hasPaidService}
                onChange={(e) =>
                  updatePayment({ hasPaidService: e.target.checked })
                }
              />
              <span>유료 서비스/상품 제공</span>
            </label>
            {config.payment.hasPaidService && (
              <div className="checkbox-grid">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={config.payment.card}
                    onChange={(e) => updatePayment({ card: e.target.checked })}
                  />
                  <span>신용/체크카드</span>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={config.payment.bankTransfer}
                    onChange={(e) =>
                      updatePayment({ bankTransfer: e.target.checked })
                    }
                  />
                  <span>계좌이체</span>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={config.payment.easyPay}
                    onChange={(e) =>
                      updatePayment({ easyPay: e.target.checked })
                    }
                  />
                  <span>간편결제</span>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={config.payment.subscription}
                    onChange={(e) =>
                      updatePayment({ subscription: e.target.checked })
                    }
                  />
                  <span>정기결제(구독)</span>
                </label>
              </div>
            )}
          </fieldset>

          <h2>4. 개인정보 옵션 및 언어</h2>
          <fieldset className="fieldset">
            <legend>수집 항목</legend>
            <div className="checkbox-grid">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={config.privacy.collectsName}
                  onChange={(e) =>
                    updatePrivacy({ collectsName: e.target.checked })
                  }
                />
                <span>이름</span>
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={config.privacy.collectsPhone}
                  onChange={(e) =>
                    updatePrivacy({ collectsPhone: e.target.checked })
                  }
                />
                <span>휴대전화번호</span>
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={config.privacy.collectsEmail}
                  onChange={(e) =>
                    updatePrivacy({ collectsEmail: e.target.checked })
                  }
                />
                <span>이메일</span>
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={config.privacy.collectsAddress}
                  onChange={(e) =>
                    updatePrivacy({ collectsAddress: e.target.checked })
                  }
                />
                <span>주소</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend>제3자 제공 및 위탁</legend>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.privacy.thirdPartyProvision}
                onChange={(e) =>
                  updatePrivacy({ thirdPartyProvision: e.target.checked })
                }
              />
              <span>PG사/배송사 등 제3자 제공</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.privacy.outsourcing}
                onChange={(e) =>
                  updatePrivacy({ outsourcing: e.target.checked })
                }
              />
              <span>개인정보 처리 위탁(호스팅, 고객센터 등)</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.privacy.overseasTransfer}
                onChange={(e) =>
                  updatePrivacy({ overseasTransfer: e.target.checked })
                }
              />
              <span>국외 이전(해외 클라우드, 해외 본사 등)</span>
            </label>
          </fieldset>

          <fieldset className="fieldset">
            <legend>보유기간</legend>
            <select
              value={config.privacy.retentionPolicy}
              onChange={(e) =>
                updatePrivacy({
                  retentionPolicy: e.target
                    .value as PrivacyOptions['retentionPolicy'],
                })
              }
            >
              <option value="NORMAL">일반형 (법정 보존기간 중심)</option>
              <option value="LONG">장기보존형 (마케팅/분쟁 대비)</option>
              <option value="CUSTOM">직접 기입 (문구 커스터마이즈 전제)</option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend>문서 언어</legend>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.languages.ko}
                onChange={(e) =>
                  updateLanguages({ ko: e.target.checked })
                }
              />
              <span>한국어</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={config.languages.en}
                onChange={(e) =>
                  updateLanguages({ en: e.target.checked })
                }
              />
              <span>영어</span>
            </label>
          </fieldset>
        </section>

        <section className="preview-column">
          <div className="disclaimer">
            이 도구는 법률 자문이 아니며, 생성된 문서는 반드시 전문가의 검토를 거쳐 사용해야 합니다.
          </div>
          <div className="preview-header">
            <div className="segmented">
              <button
                type="button"
                className={selectedDoc === 'terms' ? 'segmented-active' : ''}
                onClick={() => setSelectedDoc('terms')}
              >
                이용약관
              </button>
              <button
                type="button"
                className={selectedDoc === 'privacy' ? 'segmented-active' : ''}
                onClick={() => setSelectedDoc('privacy')}
              >
                개인정보 처리방침
              </button>
            </div>
            <div className="segmented">
              <button
                type="button"
                className={selectedLang === 'ko' ? 'segmented-active' : ''}
                onClick={() => setSelectedLang('ko')}
                disabled={!config.languages.ko}
              >
                KO
              </button>
              <button
                type="button"
                className={selectedLang === 'en' ? 'segmented-active' : ''}
                onClick={() => setSelectedLang('en')}
                disabled={!config.languages.en}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className="copy-button"
              onClick={handleCopy}
              disabled={!currentText}
            >
              전체 복사
            </button>
          </div>
          <div className="preview-area">
            {currentText ? (
              <pre>{currentText}</pre>
            ) : (
              <div className="preview-placeholder">
                선택한 언어/문서에 해당하는 내용이 없습니다. 옵션을 조정해 보세요.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
