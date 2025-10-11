'use client'

import { Suspense } from 'react'
import SurveyContent from './SurveyContent'

export default function SurveyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
          <p className="text-xl font-bold">Loading survey...</p>
        </div>
      </div>
    }>
      <SurveyContent />
    </Suspense>
  )
}