import React from 'react';
import { Trophy, Award } from 'lucide-react';

interface Winner {
  profilePhoto: string;
  userName: string;
}

interface HeroProps {
  winners: any;
}

const Hero3: React.FC<HeroProps> = ({ winners }) => {
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-b from-yellow-300 to-yellow-500';
      case 1:
        return 'bg-gradient-to-b from-gray-300 to-gray-400';
      case 2:
        return 'bg-gradient-to-b from-amber-600 to-amber-700';
      default:
        return 'bg-gray-100';
    }
  };

  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0:
        return '#FFD700';
      case 1:
        return '#C0C0C0';
      case 2:
        return '#CD7F32';
      default:
        return '#666666';
    }
  };

  return (
    <div className="bg-gradient-to-b from-teal-900 to-teal-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Quiz Champions</h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="text-yellow-400" size={24} />
            <p className="text-xl text-gray-300">
              Congratulations to our top performers!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {winners.map((winner:any, index:any) => (
            <div
              key={index}
              className={`relative transform hover:scale-105 transition-transform duration-300 ${
                index === 0 ? 'md:-mt-8' : ''
              }`}
            >
              <div
                className={`${getMedalColor(
                  index
                )} rounded-xl p-6 text-center shadow-xl relative overflow-hidden`}
              >
                {index < 3 && (
                  <div className="absolute top-4 right-4">
                    <Award size={32} color={getTrophyColor(index)} />
                  </div>
                )}
                <div className="relative">
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-white rounded-full transform scale-105 shadow-lg" />
                    <img
                      src={winner.profilePhoto}
                      alt={`${winner.userName}'s profile`}
                      className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white"
                    />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    index === 0 ? 'text-black' : 'text-gray-800'
                  }`}>
                    {winner.userName}
                  </h3>
                  <div className={`inline-block px-4 py-2 rounded-full ${
                    index === 0 ? 'bg-yellow-400' : 'bg-white/90'
                  } text-gray-900 font-semibold shadow-md`}>
                    {index === 0 && '🏆 '}
                    {index === 0 ? 'Champion' : `${index + 1}${getOrdinalSuffix(index + 1)} Place`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to add ordinal suffixes (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

export default Hero3;