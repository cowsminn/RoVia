using RoVia.API.Data;
using RoVia.API.Models;
using Microsoft.EntityFrameworkCore;

namespace RoVia.API.Services;

public class QuizService
{
    private readonly AppDbContext _context;

    public QuizService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Quiz>> GetQuizzesByAttractionAsync(int attractionId)
    {
        return await _context.Quizzes
            .Where(q => q.AttractionId == attractionId)
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .ToListAsync();
    }

    public async Task<Quiz> GetQuizWithQuestionsAsync(int quizId)
    {
        return await _context.Quizzes
            .Where(q => q.Id == quizId)
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync();
    }

    public async Task<int> SubmitQuizAsync(int userId, int quizId, Dictionary<int, int> answers)
    {
        var quiz = await GetQuizWithQuestionsAsync(quizId);
        if (quiz == null) return 0;

        int correctCount = 0;
        int totalPoints = 0;

        foreach (var question in quiz.Questions)
        {
            if (answers.TryGetValue(question.Id, out int selectedAnswerId))
            {
                var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
                if (correctAnswer?.Id == selectedAnswerId)
                {
                    correctCount++;
                    totalPoints += question.PointsValue;
                }
            }
        }

        // Calcul final cu bonus pentru dificultate
        int bonusMultiplier = quiz.DifficultyLevel;
        int finalPoints = totalPoints * bonusMultiplier;

        // Salvare progres
        var userProgress = new UserProgress
        {
            UserId = userId,
            QuizId = quizId,
            PointsEarned = finalPoints,
            CorrectAnswers = correctCount,
            TotalQuestions = quiz.Questions.Count,
            IsCompleted = true,
            CompletedAt = DateTime.UtcNow,
            TimeSpentSeconds = 0
        };

        _context.UserProgresses.Add(userProgress);

        // Update total points ale utilizatorului
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.TotalPoints += finalPoints;
            _context.Users.Update(user);
        }

        await _context.SaveChangesAsync();
        return finalPoints;
    }
}
