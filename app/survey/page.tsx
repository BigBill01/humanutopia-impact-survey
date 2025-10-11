'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { HopeIcon, ConfidenceIcon, HappinessIcon, RelationshipsIcon, EmployabilityIcon } from '../components/PillarIcons'

type Pillar = {
  name: string
  icon: React.ComponentType
  primaryColor: string
  secondaryColor: string
  questionBefore: string
  questionAfter: string
}

type Session = {
  id: string
  school_name: string
  facilitator_name: string
  year_group: string
  session_date: string
}

const pillars: Pillar[] = [
  { 
    name: 'Hope', 
    icon: HopeIcon, 
    primaryColor: '#e90d88', 
    secondaryColor: '#f92706',
    questionBefore: 'I felt inspired to make the most of my education',
    questionAfter: 'I feel inspired to make the most of my education'
  },
  { 
    name: 'Confidence', 
    icon: ConfidenceIcon, 
    primaryColor: '#05b0fe', 
    secondaryColor: '#202b59',
    questionBefore: 'I felt confident to speak up and share my ideas',
    questionAfter: 'I feel confident to speak up and share my ideas'
  },
  { 
    name: 'Happiness', 
    icon: HappinessIcon, 
    primaryColor: '#fe8210', 
    secondaryColor: '#ffd93d',
    questionBefore: 'I felt happy and positive about my future',
    questionAfter: 'I feel happy and positive about my future'
  },
  { 
    name: 'Relationships', 
    icon: RelationshipsIcon, 
    primaryColor: '#16af81', 
    secondaryColor: '#05b0fe',
    questionBefore: 'I felt connected to the people around me',
    questionAfter: 'I feel connected to the people around me'
  },
  { 
    name: 'Employability', 
    icon: EmployabilityIcon, 
    primaryColor: '#7c04d5', 
    secondaryColor: '#e90d88',
    questionBefore: 'I felt confident about my future career prospects',
    questionAfter: 'I feel confident about my future career prospects'
  },
]

export default function SurveyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('s')

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [score, setScore] = useState(5)
  const [fadeIn, setFadeIn] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load session data
  useEffect(() => {
    async function loadSession() {
      if (!sessionId) {
        setError('No session ID provided. Please scan a valid QR code.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/session/${sessionId}`)
        if (!response.ok) {
          throw new Error('Session not found')
        }
        const data = await response.json()
        setSession(data)
        setLoading(false)
        setTimeout(() => setMounted(true), 100)
      } catch (err) {
        setError('Invalid session. Please contact your facilitator.')
        setLoading(false)
      }
    }

    loadSession()
  }, [sessionId])

  // Fade animation when question changes
  useEffect(() => {
    setFadeIn(false)
    const timer = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(timer)
  }, [currentQuestion])

  const totalQuestions = 10
  const progress = (currentQuestion / totalQuestions) * 100

  const currentPillarIndex = Math.floor((currentQuestion - 1) / 2)
  const currentPillar = pillars[currentPillarIndex]
  const IconComponent = currentPillar.icon
  const isBefore = currentQuestion % 2 === 1

  const currentQuestionText = isBefore ? currentPillar.questionBefore : currentPillar.questionAfter

  const headerGradient = `linear-gradient(135deg, ${currentPillar.primaryColor}dd, ${currentPillar.secondaryColor}dd)`
  const progressGradient = `linear-gradient(to right, ${currentPillar.primaryColor}50, ${currentPillar.secondaryColor}50)`
  const cardBackground = `linear-gradient(to bottom right, white, ${currentPillar.primaryColor}03, ${currentPillar.secondaryColor}03)`
  const pillarBoxBackground = `linear-gradient(135deg, ${currentPillar.primaryColor}08, ${currentPillar.secondaryColor}08)`
  const sliderGradient = `linear-gradient(to right, ${currentPillar.primaryColor}30, ${currentPillar.primaryColor}50, ${currentPillar.secondaryColor}50, ${currentPillar.secondaryColor}30)`
  const buttonGradient = `linear-gradient(135deg, ${currentPillar.primaryColor}, ${currentPillar.secondaryColor})`
  const thumbGradient = `linear-gradient(135deg, ${currentPillar.primaryColor}, ${currentPillar.secondaryColor})`

  const saveResponse = async () => {
    if (!sessionId) return

    setSaving(true)
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          pillar: currentPillar.name,
          is_before: isBefore,
          score: score
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save response')
      }
    } catch (err) {
      console.error('Error saving response:', err)
      // Continue anyway - we don't want to block the user
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    // Save the current response
    await saveResponse()

    if (currentQuestion >= totalQuestions) {
      router.push('/survey/completed')
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setScore(5) // Reset score for next question
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
          <p className="text-xl font-bold">Loading session...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-hu-black mb-4">Oops!</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Please scan a valid QR code or contact your Humanutopia facilitator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header with smooth gradient transition */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 transition-all duration-700 ease-in-out" 
          style={{ background: headerGradient }}
        ></div>
        <div className={`relative py-6 px-4 text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-1">
              Humanutopia Impact Survey
            </h1>
            {session && (
              <p className="text-white/95 text-sm md:text-base">
                {session.school_name} | {session.year_group} | {new Date(session.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, background: progressGradient }}
            />
          </div>
          <p className="text-center text-xs text-hu-black/60 mt-2">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        {/* Question Card with fade animation */}
        <div 
          className={`flex-1 flex flex-col bg-white rounded-2xl border-2 p-6 md:p-8 shadow-lg transition-all duration-500 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ 
            borderColor: `${currentPillar.primaryColor}15`,
            background: cardBackground,
            transitionProperty: 'all, background, border-color',
            transitionDuration: '500ms, 700ms, 700ms'
          }}
        >
          {/* Pillar Header */}
          <div 
            className="flex items-center justify-center gap-6 rounded-xl p-6 mb-6 transition-all duration-700"
            style={{ 
              background: pillarBoxBackground,
              border: `2px solid ${currentPillar.primaryColor}12`
            }}
          >
            <div className="transition-transform duration-500 hover:scale-110">
              <IconComponent />
            </div>
            <h2 
              className="text-3xl md:text-4xl font-bold transition-colors duration-700"
              style={{ color: currentPillar.primaryColor }}
            >
              {currentPillar.name}
            </h2>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-base text-hu-black/50 mb-2">
              {isBefore ? "Before today's session..." : "After today's session..."}
            </p>
            <p className="text-xl md:text-2xl text-hu-black font-semibold">
              {currentQuestionText}
            </p>
          </div>

          {/* Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-hu-black/60 mb-3">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            
            <div className="relative">
              <div 
                className="h-3 rounded-full shadow-inner transition-all duration-700" 
                style={{ background: sliderGradient }}
              ></div>
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="absolute top-0 w-full h-3 appearance-none bg-transparent cursor-pointer slider-input"
              />
              <style jsx>{`
                .slider-input::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${thumbGradient};
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  transition: all 0.7s ease-in-out;
                }
                
                .slider-input::-webkit-slider-thumb:hover {
                  transform: scale(1.2);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                
                .slider-input::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${thumbGradient};
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  transition: all 0.7s ease-in-out;
                }
                
                .slider-input::-moz-range-thumb:hover {
                  transform: scale(1.2);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
              `}</style>
            </div>
            
            <div className="text-center mt-5">
              <span className="text-5xl md:text-6xl font-bold text-hu-black transition-all duration-300">
                {score}
              </span>
              <span className="text-2xl text-hu-black/30 ml-1">/10</span>
            </div>
          </div>

          {/* Button */}
          <button  
            onClick={handleNext}
            disabled={saving}
            className="w-full text-white font-bold text-lg py-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: buttonGradient,
              transitionProperty: 'all, background',
              transitionDuration: '300ms, 700ms'
            }}
          >
            {saving ? 'Saving...' : currentQuestion >= totalQuestions ? 'Complete Survey ✓' : 'Next Question →'}
          </button>

          {/* Help Text */}
          <p className="text-center text-xs text-hu-black/40 mt-4">
            Your answers are anonymous and help us improve our programs
          </p>
        </div>
      </div>
    </div>
  )
}