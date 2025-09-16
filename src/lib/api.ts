const API_BASE_URL = 'https://api.yourdomain.com' // Replace with your Cloudflare Worker URL

export interface ShareLinkResponse {
  shareId: string
  expiresAt: string
}

export interface SavedCalculation {
  id: string
  userId: string
  name: string
  calculationData: any
  createdAt: string
  updatedAt: string
}

class ApiClient {
  private getAuthToken(): string | null {
    // In a real implementation, get the JWT token from Clerk
    return localStorage.getItem('clerk-token') || null
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
  }

  async createShareLink(calculationData: any, isPrivate: boolean, userId?: string): Promise<ShareLinkResponse> {
    const response = await this.request('/api/share/create', {
      method: 'POST',
      body: JSON.stringify({ calculationData, isPrivate, userId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create share link')
    }

    return response.json()
  }

  async getShareLink(shareId: string): Promise<any> {
    const response = await this.request(`/api/share/${shareId}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Share link not found or expired')
      }
      if (response.status === 410) {
        throw new Error('Share link has expired')
      }
      throw new Error('Failed to load share link')
    }

    return response.json()
  }

  async saveCalculation(name: string, calculationData: any): Promise<SavedCalculation> {
    const response = await this.request('/api/saved', {
      method: 'POST',
      body: JSON.stringify({ name, calculationData }),
    })

    if (!response.ok) {
      throw new Error('Failed to save calculation')
    }

    return response.json()
  }

  async getSavedCalculations(): Promise<SavedCalculation[]> {
    const response = await this.request('/api/saved')

    if (!response.ok) {
      throw new Error('Failed to load saved calculations')
    }

    return response.json()
  }

  async deleteCalculation(calcId: string): Promise<void> {
    const response = await this.request(`/api/saved/${calcId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete calculation')
    }
  }
}

export const apiClient = new ApiClient()
