export type TermsLanguage = 'ko' | 'en'

export type TermsCondition = {
  businessType?: 'B2B' | 'B2C' | 'B2B_B2C'
  hasPaidService?: boolean
}

export type TermsClause = {
  id: string
  order: number
  language: TermsLanguage
  title: string
  body: string
  conditions?: TermsCondition
}

export const termsClauses: TermsClause[] = [
  {
    id: 'purpose-ko',
    order: 1,
    language: 'ko',
    title: '제1조(목적)',
    body:
      '{{companyName}}(이하 “회사”)가 제공하는 {{serviceName}}(이하 “서비스”)의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항 등을 규정함을 목적으로 합니다.',
  },
  {
    id: 'purpose-en',
    order: 1,
    language: 'en',
    title: 'Article 1 (Purpose)',
    body:
      'These Terms and Conditions set forth the rights, obligations and responsibilities between {{companyName}} (the "Company") and users in connection with the use of the {{serviceName}} service (the "Service").',
  },
  {
    id: 'membership-ko',
    order: 2,
    language: 'ko',
    title: '제2조(회원 가입 및 계정)',
    body:
      '① 서비스 이용을 위해 이용자는 회사가 정한 절차에 따라 회원 가입을 신청하여야 하며, 회사는 관련 법령 및 회사 정책에 따라 회원 가입 신청을 승낙할 수 있습니다.\n' +
      '② 회원은 계정 및 비밀번호에 대한 관리 책임이 있으며, 제3자에게 대여, 양도, 담보 제공을 할 수 없습니다.',
  },
  {
    id: 'paid-service-ko',
    order: 10,
    language: 'ko',
    title: '제10조(유료 서비스 및 결제)',
    body:
      '① 회사는 유료 서비스의 결제 수단으로 신용·체크카드, 계좌이체, 간편결제, 정기결제 등 회사가 정하는 방식을 제공할 수 있습니다.\n' +
      '② 결제와 관련된 전자지급결제대행 업무는 관련 법령에 따라 회사와 제휴한 전자지급결제대행업체(PG사)가 수행합니다.',
    conditions: {
      hasPaidService: true,
    },
  },
]

