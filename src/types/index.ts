export * from './auth'
export * from './blog'
export * from './category'
export * from './comment'
export * from './reply'
export * from './theme'
export * from './user'

export interface ResponseData {
  path: string
  per_page: number
  to: number
  total: number
  from: number
  last_page: number
  current_page: number
}
