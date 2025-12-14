using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoVia.API.Services;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace RoVia.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    private readonly QuizService _quizService;
    private readonly ProfileService _profileService;

    public QuizController(QuizService quizService, ProfileService profileService)
    {
        _quizService = quizService;
        _profileService = profileService;
    }

    // GET: lista quiz-uri pentru o atracție
    [AllowAnonymous]
    [HttpGet("attraction/{attractionId}")]
    public async Task<IActionResult> GetQuizzesByAttraction(int attractionId)
    {
        var quizzes = await _quizService.GetQuizzesByAttractionAsync(attractionId);
        var result = quizzes.Select(q => new {
            q.Id,
            q.Title,
            q.Description,
            q.DifficultyLevel,
            q.TimeLimit,
            QuestionsCount = q.Questions?.Count ?? 0
        });
        return Ok(result);
    }

    // GET: detalii quiz cu întrebări și răspunsuri
    [AllowAnonymous]
    [HttpGet("{quizId}")]
    public async Task<IActionResult> GetQuiz(int quizId)
    {
        var quiz = await _quizService.GetQuizWithQuestionsAsync(quizId);
        if (quiz == null) return NotFound();

        return Ok(new
        {
            quiz.Id,
            quiz.Title,
            quiz.Description,
            quiz.DifficultyLevel,
            quiz.TimeLimit,
            Questions = quiz.Questions.Select(q => new
            {
                q.Id,
                q.Text,
                q.PointsValue,
                Answers = q.Answers.Select(a => new
                {
                    a.Id,
                    a.Text,
                    a.Order
                }).OrderBy(a => a.Order)
            }).OrderBy(q => q.Id)
        });
    }

    // POST: submit quiz răspunsuri (protejat)
    [Authorize]
    [HttpPost("{quizId}/submit")]
    public async Task<IActionResult> SubmitQuiz(int quizId, [FromBody] Dictionary<int, int> answers)
    {
        // Citire user id din token - încercămClaimTypes.NameIdentifier sau sub
        int userId = 0;
        var nameId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(nameId) && int.TryParse(nameId, out var nid)) userId = nid;
        else
        {
            var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (!string.IsNullOrEmpty(sub) && int.TryParse(sub, out var sid)) userId = sid;
        }

        if (userId == 0) return Unauthorized();

        var points = await _quizService.SubmitQuizAsync(userId, quizId, answers);
        await _profileService.CheckAndUnlockBadgesAsync(userId);

        return Ok(new { pointsEarned = points });
    }
}
