import { applyPlaceholders } from './placeholder'
import { privacyClauses, type PrivacyClause } from '../templates/privacyTemplates'

export type PrivacyGenerationOptions = {
  languageKo: boolean
  languageEn: boolean
  collectsAddress: boolean
  thirdPartyProvision: boolean
  outsourcing: boolean
  overseasTransfer: boolean
  context: Record<string, string>
  legalTextById?: Record<string, string>
}

function matchesPrivacyConditions(
  clause: PrivacyClause,
  options: PrivacyGenerationOptions,
): boolean {
  if (!clause.conditions) return true

  if (
    typeof clause.conditions.collectsAddress === 'boolean' &&
    clause.conditions.collectsAddress !== options.collectsAddress
  ) {
    return false
  }

  if (
    typeof clause.conditions.thirdPartyProvision === 'boolean' &&
    clause.conditions.thirdPartyProvision !== options.thirdPartyProvision
  ) {
    return false
  }

  if (
    typeof clause.conditions.outsourcing === 'boolean' &&
    clause.conditions.outsourcing !== options.outsourcing
  ) {
    return false
  }

  if (
    typeof clause.conditions.overseasTransfer === 'boolean' &&
    clause.conditions.overseasTransfer !== options.overseasTransfer
  ) {
    return false
  }

  return true
}

export function generatePrivacy(options: PrivacyGenerationOptions): {
  ko?: string
  en?: string
} {
  const { languageKo, languageEn, context, legalTextById } = options

  const sorted = [...privacyClauses].sort((a, b) => a.order - b.order)

  const koClauses: string[] = []
  const enClauses: string[] = []

  for (const clause of sorted) {
    if (!matchesPrivacyConditions(clause, options)) continue

    const baseBody = legalTextById?.[clause.id] ?? clause.body
    const text = `${clause.title}\n\n${applyPlaceholders(baseBody, context)}`

    if (clause.language === 'ko' && languageKo) {
      koClauses.push(text)
    } else if (clause.language === 'en' && languageEn) {
      enClauses.push(text)
    }
  }

  return {
    ko: languageKo ? koClauses.join('\n\n') : undefined,
    en: languageEn ? enClauses.join('\n\n') : undefined,
  }
}

