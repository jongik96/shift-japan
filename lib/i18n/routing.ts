// Simple routing utilities for getting table names based on locale
// Re-export Locale type and functions from config for convenience
import { type Locale, getTableName as _getTableName } from './config'

export type { Locale }
export { getTableName } from './config'

