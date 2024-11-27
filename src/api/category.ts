import { $get } from '@/api/axios'

export async function apiGetCategories() {
  return $get('/categories')
}

export async function apitGetCategoryBySlug(slug: string, config: any) {
  return $get(`/categories/${slug}`, config)
}
