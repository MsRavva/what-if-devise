export interface WhatIfRequest {
  story: string
  whatIfQuestion: string
}

export interface WhatIfResponse {
  scenario: string
  success: boolean
  error?: string
}