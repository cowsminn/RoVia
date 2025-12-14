import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import quizService from '../services/quizService';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const attractionName = location.state?.attractionName || 'Atracție';

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuiz(quizId);
        setQuiz(data);
        setTimeLeft(data.timeLimit);
      } catch (error) {
        console.error('Eroare:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await quizService.submitQuiz(quizId, answers);
      navigate('/profile', { state: { pointsEarned: result.pointsEarned } });
    } catch (error) {
      console.error('Eroare la trimiterea quiz-ului:', error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px', color: '#6b7280' }}>
        Se încarcă quiz-ul...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px', color: '#ef4444' }}>
        Quiz-ul nu a fost găsit
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} userName="User" />

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ paddingTop: '80px', paddingLeft: sidebarOpen ? '250px' : '0', transition: 'padding-left 0.3s' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
          
          {/* Header */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ margin: '0 0 8px 0', color: '#374151' }}>
              📍 {attractionName}
            </h1>
            <h2 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '24px' }}>
              {quiz.title}
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <p style={{ margin: 0, color: '#6b7280' }}>
                {quiz.questions.length} întrebări
              </p>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: timeLeft < 30 ? '#ef4444' : '#3b82f6'
              }}>
                ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Questions */}
          {quiz.questions.map((question, idx) => (
            <div
              key={question.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '16px' }}>
                {idx + 1}. {question.text}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {question.answers.map(answer => (
                  <label
                    key={answer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: answers[question.id] === answer.id ? '#dbeafe' : '#f9fafb',
                      borderRadius: '8px',
                      border: answers[question.id] === answer.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={answer.id}
                      checked={answers[question.id] === answer.id}
                      onChange={() => handleAnswerSelect(question.id, answer.id)}
                      style={{ marginRight: '12px', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#374151' }}>{answer.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: isSubmitting ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '24px'
            }}
          >
            {isSubmitting ? 'Se trimite...' : '✓ Finalizează Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
