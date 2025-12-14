using RoVia.API.Data;
using RoVia.API.Models;
using Microsoft.EntityFrameworkCore;

namespace RoVia.API.Services;

public class ProfileService
{
    private readonly AppDbContext _context;

    public ProfileService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<dynamic> GetUserProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        var quizzesCompleted = await _context.UserProgresses
            .Where(up => up.UserId == userId && up.IsCompleted)
            .CountAsync();

        var badges = await _context.UserBadges
            .Where(ub => ub.UserId == userId)
            .Include(ub => ub.Badge)
            .ToListAsync();

        var recentProgress = await _context.UserProgresses
            .Where(up => up.UserId == userId)
            .OrderByDescending(up => up.CompletedAt)
            .Take(5)
            .Include(up => up.Quiz)
            .ThenInclude(q => q.Attraction)
            .ToListAsync();

        return new
        {
            user.Id,
            user.Username,
            user.Email,
            user.TotalPoints,
            QuizzesCompleted = quizzesCompleted,
            Badges = badges.Select(b => new
            {
                b.Badge.Id,
                b.Badge.Name,
                b.Badge.Description,
                b.Badge.IconUrl,
                UnlockedAt = b.UnlockedAt
            }),
            RecentProgress = recentProgress.Select(p => new
            {
                p.Quiz.Title,
                p.Quiz.Attraction.Name,
                p.PointsEarned,
                p.CorrectAnswers,
                p.TotalQuestions,
                p.CompletedAt
            })
        };
    }

    public async Task CheckAndUnlockBadgesAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        var allBadges = await _context.Badges.ToListAsync();

        foreach (var badge in allBadges)
        {
            var alreadyUnlocked = await _context.UserBadges
                .AnyAsync(ub => ub.UserId == userId && ub.BadgeId == badge.Id);

            if (alreadyUnlocked) continue;

            var criteria = System.Text.Json.JsonDocument.Parse(badge.Criteria);
            bool shouldUnlock = true;

            if (criteria.RootElement.TryGetProperty("totalPoints", out var pointsReq))
            {
                if (user.TotalPoints < pointsReq.GetInt32())
                    shouldUnlock = false;
            }

            if (criteria.RootElement.TryGetProperty("quizzesCompleted", out var quizzesReq))
            {
                var completed = await _context.UserProgresses
                    .Where(up => up.UserId == userId && up.IsCompleted)
                    .CountAsync();
                
                if (completed < quizzesReq.GetInt32())
                    shouldUnlock = false;
            }

            if (shouldUnlock)
            {
                _context.UserBadges.Add(new UserBadge
                {
                    UserId = userId,
                    BadgeId = badge.Id,
                    UnlockedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();
    }
}
