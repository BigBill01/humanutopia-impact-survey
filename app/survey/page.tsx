'use client'

import { useState } from 'react'

export default function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [hopeBeforeScore, setHopeBeforeScore] = useState(5)
  
  const totalQuestions = 10
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-hu-pink via-hu-red to-hu-orange py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Humanutopia Impact Survey
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            Oasis Academy Enfield | Year 10 | October 15, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-hu-gray-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-hu-pink via-hu-blue-light to-hu-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-hu-black mt-2">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl border-2 border-hu-gray-light p-6 md:p-8 shadow-lg">
          {/* Pillar Header */}
          <div className="flex items-center gap-3 bg-hu-pink/10 rounded-lg p-4 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl">
              ❤️
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-hu-pink">
              Hope
            </h2>
          </div>

          {/* Question Section */}
          <div className="mb-8">
            <p className="text-base md:text-lg text-hu-black/70 mb-2">
              Before today's session...
            </p>
            <p className="text-lg md:text-xl text-hu-black font-medium">
              I felt inspired to make the most of my education
            </p>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-between text-xs md:text-sm text-hu-black mb-3">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={hopeBeforeScore}
              onChange={(e) => setHopeBeforeScore(parseInt(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff6b6b 0%, #ffd93d 50%, #6bcf7f 100%)',
              }}
            />
            
            <div className="text-center mt-6">
              <div className="inline-block">
                <span className="text-5xl md:text-6xl font-bold text-hu-black">
                  {hopeBeforeScore}
                </span>
                <span className="text-2xl text-hu-black/50 ml-1">/10</span>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="w-full bg-gradient-to-r from-hu-red to-hu-orange text-white font-bold text-lg py-4 px-8 rounded-full hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
          >
            Next Question →
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-hu-black/50 mt-6">
          Your answers are anonymous and help us improve our programs
        </p>
      </div>
    </div>
  )
}