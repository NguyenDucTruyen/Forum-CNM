import type { ResponseCategoryData } from '@/types'

import { $get } from '@/api/axios'

export async function apiGetCategories() {
  return $get('/getListCategory') as Promise<ResponseCategoryData>
}
