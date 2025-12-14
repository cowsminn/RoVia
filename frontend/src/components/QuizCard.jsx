import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizCard({ quiz, attractionName }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getDifficultyColor = (level) => {
    switch(level) {
      case 1: return '#10b981'; // Green - Easy
      case 2: return '#f59e0b'; // Amber - Medium
      case 3: return '#ef4444'; // Red - Hard
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = (level) => {
    const labels = { 1: 'Ușor', 2: 'Mediu', 3: 'Greu' };
    return labels[level] || 'Necunoscut';
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz.id}`, { state: { attractionName } });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '16px', fontWeight: 'bold' }}>
            🎯 {quiz.title}
          </h3>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
            {quiz.description}
          </p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: '#6b7280' }}>
              ⏱️ {Math.floor(quiz.timeLimit / 60)} min
            </span>
            <span style={{ 
              color: 'white',
              backgroundColor: getDifficultyColor(quiz.difficultyLevel),
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {getDifficultyLabel(quiz.difficultyLevel)}
            </span>
            <span style={{ color: '#6b7280' }}>
              ❓ {quiz.questions?.length || 0} întrebări
            </span>
          </div>
        </div>
        <button
          onClick={handleStartQuiz}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginLeft: '12px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          Start →
        </button>
      </div>
    </div>
  );
}

export default QuizCard;
