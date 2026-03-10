import { applyPlaceholders } from './placeholder'
import { termsClauses, type TermsClause } from '../templates/termsTemplates'

export type TermsGenerationOptions = {
  languageKo: boolean
  languageEn: boolean
  businessType: 'B2B' | 'B2C' | 'B2B_B2C' | 'OTHER'
  hasPaidService: boolean
  context: Record<string, string>
}

function matchesConditions(clause: TermsClause, options: TermsGenerationOptions): boolean {
  if (!clause.conditions) return true
  const { businessType, hasPaidService } = options

  if (clause.conditions.businessType && clause.conditions.businessType !== businessType) {
    return false
  }

  if (
    typeof clause.conditions.hasPaidService === 'boolean' &&
    clause.conditions.hasPaidService !== hasPaidService
  ) {
    return false
  }

  return true
}

export function generateTerms(options: TermsGenerationOptions): {
  ko?: string
  en?: string
} {
  const { languageKo, languageEn, context } = options

  const sorted = [...termsClauses].sort((a, b) => a.order - b.order)

  const koClauses: string[] = []
  const enClauses: string[] = []

  for (const clause of sorted) {
    if (!matchesConditions(clause, options)) continue

    const text = `${clause.title}\n\n${applyPlaceholders(clause.body, context)}`

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

