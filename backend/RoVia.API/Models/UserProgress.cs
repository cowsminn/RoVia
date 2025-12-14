namespace RoVia.API.Models;

public class UserProgress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int QuizId { get; set; }
    public int PointsEarned { get; set; }
    public double TimeSpentSeconds { get; set; }
    public int CorrectAnswers { get; set; }
    public int TotalQuestions { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CompletedAt { get; set; }
    
    // Navigation
    public User User { get; set; }
    public Quiz Quiz { get; set; }
}

public class UserBadge
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BadgeId { get; set; }
    public DateTime UnlockedAt { get; set; }
    
    // Navigation
    public User User { get; set; }
    public Badge Badge { get; set; }
}

public class Badge
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string IconUrl { get; set; }
    public int RequiredPoints { get; set; }
    public string Criteria { get; set; } // JSON: {"quizzesCompleted": 5, "totalPoints": 100}
    
    // Navigation
    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}
