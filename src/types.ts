export type PolicyStatus = 'Active' | 'Inactive'

export interface Policy {
  policyNumber: number
  productName: string
  policyDescription: string
  policyStatus: PolicyStatus
  policyStartDate: string
  yearlyPrice: number
}

export interface PolicyFilters {
  products: string[]
  statuses: PolicyStatus[]
}
