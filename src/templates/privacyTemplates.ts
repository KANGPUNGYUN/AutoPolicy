export type PrivacyLanguage = 'ko' | 'en'

export type PrivacyCondition = {
  collectsAddress?: boolean
  thirdPartyProvision?: boolean
  outsourcing?: boolean
  overseasTransfer?: boolean
}

export type PrivacyClause = {
  id: string
  order: number
  language: PrivacyLanguage
  title: string
  body: string
  conditions?: PrivacyCondition
}

export const privacyClauses: PrivacyClause[] = [
  {
    id: 'intro-ko',
    order: 1,
    language: 'ko',
    title: '제1조(총칙)',
    body:
      '{{companyName}}(이하 “회사”)는 「개인정보 보호법」 등 관련 법령을 준수하며, 정보주체의 개인정보를 안전하게 보호하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.',
  },
  {
    id: 'intro-en',
    order: 1,
    language: 'en',
    title: 'Article 1 (General)',
    body:
      '{{companyName}} (the "Company") complies with applicable privacy laws and regulations and establishes this Privacy Policy to safely protect the personal information of data subjects.',
  },
  {
    id: 'collection-items-ko',
    order: 2,
    language: 'ko',
    title: '제2조(처리하는 개인정보의 항목)',
    body:
      '회사는 다음과 같은 개인정보 항목을 처리할 수 있습니다.\n' +
      '- 필수: 이름, 연락처, 이메일 등 회원 관리 및 서비스 제공에 필요한 정보\n' +
      '- 선택: 마케팅 수신 동의 여부, 추가 연락처 등',
  },
  {
    id: 'address-ko',
    order: 3,
    language: 'ko',
    title: '제3조(배송 및 서비스 제공을 위한 정보)',
    body:
      '상품 배송 또는 오프라인 서비스 제공이 필요한 경우, 회사는 수령인 이름, 주소, 연락처 등 배송에 필요한 최소한의 정보를 처리할 수 있습니다.',
    conditions: {
      collectsAddress: true,
    },
  },
  {
    id: 'third-party-ko',
    order: 10,
    language: 'ko',
    title: '제10조(개인정보의 제3자 제공)',
    body:
      '회사는 원칙적으로 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않으며, 결제, 배송, 본인확인 등 서비스를 제공하기 위하여 필요한 범위 내에서 관련 법령에 따라 제3자에게 개인정보를 제공할 수 있습니다.',
    conditions: {
      thirdPartyProvision: true,
    },
  },
  {
    id: 'outsourcing-ko',
    order: 11,
    language: 'ko',
    title: '제11조(개인정보 처리의 위탁)',
    body:
      '회사는 안정적인 서비스 제공을 위하여 고객센터 운영, 시스템 유지보수, 데이터 보관 등 일부 업무를 외부 전문업체에 위탁할 수 있으며, 이 경우 관련 법령에 따라 위탁계약을 체결하고 수탁자를 관리·감독합니다.',
    conditions: {
      outsourcing: true,
    },
  },
]

