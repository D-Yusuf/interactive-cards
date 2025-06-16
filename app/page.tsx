'use client'
import { useState } from 'react';
import GameBoard from './components/GameBoard';
import TeamScore from './components/TeamScore';

export default function Home() {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const handleTeamScoreUpdate = (teamId: number, points: number) => {
    if (teamId === 1) {
      setTeam1Score(prev => prev + points);
    } else if (teamId === 2) {
      setTeam2Score(prev => prev + points);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-dark via-game-secondary to-game-primary text-game-light p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">لعبة الأسئلة</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Scores */}
          <div className="lg:col-span-3 flex justify-between gap-4">
            <TeamScore teamName="الفريق الأول" score={team1Score} />
            <TeamScore teamName="الفريق الثاني" score={team2Score} />
          </div>

          {/* Game Board */}
          <div className="lg:col-span-3">
            <GameBoard onTeamScoreUpdate={handleTeamScoreUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
