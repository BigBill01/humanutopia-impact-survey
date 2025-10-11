'use client'

import React, { useState, useEffect } from 'react';
import { Instagram, Check } from 'lucide-react';

const SurveyCompletion = () => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showContent, setShowContent] = useState(false);
  

  useEffect(() => {
    // Trigger checkmark animation
    setTimeout(() => setShowCheckmark(true), 300);
    // Show content after checkmark
    setTimeout(() => setShowContent(true), 1200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Animated Checkmark Circle */}
        <div className="flex justify-center mb-8">
          <div 
            className={`
              w-32 h-32 rounded-full bg-white flex items-center justify-center
              transform transition-all duration-700 ease-out
              ${showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `}
          >
            <div 
              className={`
                w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600
                flex items-center justify-center
                transform transition-all duration-500 delay-300
                ${showCheckmark ? 'scale-100' : 'scale-0'}
              `}
            >
              <Check 
                size={64} 
                className={`
                  text-white stroke-[3]
                  transform transition-all duration-500 delay-500
                  ${showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                `}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className={`
            bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center
            transform transition-all duration-700 delay-700
            ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}
        >
          {/* Thank You Message */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#303030' }}>
            thank you!
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-700">
            your responses have been recorded
          </p>

          {/* Separator */}
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 mx-auto mb-8 rounded-full"></div>

          {/* Impact Message */}
          <div className="mb-10">
            <p className="text-lg text-gray-700 mb-4">
              your voice matters and helps us understand the impact of humanutopia's programmes.
            </p>
            <p className="text-base text-gray-600">
              we'll use this data to show schools how our work creates positive change.
            </p>
          </div>

          {/* Instagram CTA */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-8">
            <p className="text-gray-700 mb-4 font-semibold">
              want to see more of what we do?
            </p>
            <a
              href="https://www.instagram.com/humanutopia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Instagram size={28} />
              follow @humanutopia
            </a>
          </div>

          {/* Close Window Message */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              you can now close this window
            </p>
          </div>
        </div>

        {/* Humanutopia Branding */}
        <div className="text-center mt-8">
          <div className="inline-block">
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-orange-300 to-yellow-300">
              hu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyCompletion;