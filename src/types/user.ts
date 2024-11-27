export interface UserData {
  id: string
  firstName: string | null
  lastName: string
  gender: string | null
  phone: number | null
  dayOfBirth: string | null
  email: string
  email_verified_at: string | null
  google_id: string
  profileImage: string
  isActive: boolean
  roleName: string
  expires_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface RequestUpdateUser {
  firstName: string
  lastName: string
  gender: string
  dayOfBirth: string
  phone: number
  profileImage: string
}

export interface ResponseGetUser {
  message: string
  data: UserData
}
export interface ResponseListUser {
  docs: UserData[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
}
