import api from './api';

const quizService = {
  async getQuizzesByAttraction(attractionId) {
    try {
      const response = await api.get(`/quiz/attraction/${attractionId}`);
      return response.data;
    } catch (error) {
      console.error('Eroare la încărcarea quiz-urilor:', error);
      return []; // Returnează array gol dacă eroare
    }
  },

  async getQuiz(quizId) {
    try {
      const response = await api.get(`/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Eroare la încărcarea quiz-ului:', error);
      throw error;
    }
  },

  async submitQuiz(quizId, answers) {
    try {
      const response = await api.post(`/quiz/${quizId}/submit`, answers);
      return response.data;
    } catch (error) {
      console.error('Eroare la trimiterea quiz-ului:', error);
      throw error;
    }
  }
};

export default quizService;
