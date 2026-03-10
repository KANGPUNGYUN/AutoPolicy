type PlaceholderContext = Record<string, string>

const PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g

export function applyPlaceholders(template: string, context: PlaceholderContext): string {
  return template.replace(PLACEHOLDER_REGEX, (_, key: string) => {
    const value = context[key]
    return value ?? ''
  })
}

