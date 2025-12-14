using RoVia.API.Models;

namespace RoVia.API.Data;

public static class DataSeeder
{
    public static void SeedAttractions(AppDbContext context)
    {
        // Înlocuire: nu mai ieși imediat dacă există atracții.
        // Adaugă atracțiile doar când nu există, dar continuă să rulezi seed pentru quiz-uri și badge-uri.
        if (!context.Attractions.Any())
        {
            var attractions = new List<Attraction>
            {
                new Attraction
                {
                    Name = "Castelul Peleș",
                    Description = "Castel regal din secolul XIX, situat în Sinaia, Prahova.",
                    Latitude = 45.3599,
                    Longitude = 25.5428,
                    Type = AttractionType.Historic,
                    Region = "Prahova",
                    ImageUrl = "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
                    Rating = 4.8,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Attraction
                {
                    Name = "Palatul Parlamentului",
                    Description = "Una dintre cele mai mari clădiri administrative din lume.",
                    Latitude = 44.4268,
                    Longitude = 26.0873,
                    Type = AttractionType.Cultural,
                    Region = "București",
                    ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34d19",
                    Rating = 4.5,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Attraction
                {
                    Name = "Cetatea Râșnov",
                    Description = "Fortificație medievală din secolul XIII.",
                    Latitude = 45.5877,
                    Longitude = 25.4608,
                    Type = AttractionType.Historic,
                    Region = "Brașov",
                    ImageUrl = "https://images.unsplash.com/photo-1565031491910-e57fac031c41",
                    Rating = 4.3,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Attraction
                {
                    Name = "Lacul Roșu",
                    Description = "Lac natural format în urma unei alunecări de teren.",
                    Latitude = 46.6895,
                    Longitude = 25.9525,
                    Type = AttractionType.Natural,
                    Region = "Harghita",
                    ImageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
                    Rating = 4.6,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Attraction
                {
                    Name = "Mănăstirea Voroneț",
                    Description = "Mănăstire celebră pentru frescele sale exterioare.",
                    Latitude = 47.5414,
                    Longitude = 25.9167,
                    Type = AttractionType.Religious,
                    Region = "Suceava",
                    ImageUrl = "https://images.unsplash.com/photo-1574958269340-fa927503f3dd",
                    Rating = 4.7,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Attractions.AddRange(attractions);
            context.SaveChanges();
        }

        // Adaugă Quiz-uri dacă nu există
        if (!context.Quizzes.Any())
        {
            var allAttractions = context.Attractions.ToList();
            
            foreach (var attraction in allAttractions.Take(3))
            {
                var quiz = new Quiz
                {
                    AttractionId = attraction.Id,
                    Title = $"Quiz: {attraction.Name}",
                    Description = $"Testează-ți cunoștințele despre {attraction.Name}",
                    DifficultyLevel = 2,
                    TimeLimit = 300, // 5 minute
                    CreatedAt = DateTime.UtcNow
                };

                context.Quizzes.Add(quiz);
                context.SaveChanges();

                // Adaugă întrebări
                var questions = new List<Question>
                {
                    new Question
                    {
                        QuizId = quiz.Id,
                        Text = $"Care este caracteristica principală a {attraction.Name}?",
                        PointsValue = 10,
                        Order = 1,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Question
                    {
                        QuizId = quiz.Id,
                        Text = $"În ce regiune se află {attraction.Name}?",
                        PointsValue = 10,
                        Order = 2,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Question
                    {
                        QuizId = quiz.Id,
                        Text = $"Care dintre următoarele este adevărat despre {attraction.Name}?",
                        PointsValue = 15,
                        Order = 3,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Questions.AddRange(questions);
                context.SaveChanges();

                // Adaugă răspunsuri pentru fiecare întrebare
                var questionsWithIds = context.Questions.Where(q => q.QuizId == quiz.Id).ToList();

                // Răspunsuri pentru Q1
                context.Answers.AddRange(new List<Answer>
                {
                    new Answer { QuestionId = questionsWithIds[0].Id, Text = "Frumusețe și importanță istorică", IsCorrect = true, Order = 1 },
                    new Answer { QuestionId = questionsWithIds[0].Id, Text = "Zgomot și poluare", IsCorrect = false, Order = 2 },
                    new Answer { QuestionId = questionsWithIds[0].Id, Text = "Poluare extremă", IsCorrect = false, Order = 3 }
                });

                // Răspunsuri pentru Q2
                context.Answers.AddRange(new List<Answer>
                {
                    new Answer { QuestionId = questionsWithIds[1].Id, Text = attraction.Region, IsCorrect = true, Order = 1 },
                    new Answer { QuestionId = questionsWithIds[1].Id, Text = "București", IsCorrect = false, Order = 2 },
                    new Answer { QuestionId = questionsWithIds[1].Id, Text = "Constanța", IsCorrect = false, Order = 3 }
                });

                // Răspunsuri pentru Q3
                context.Answers.AddRange(new List<Answer>
                {
                    new Answer { QuestionId = questionsWithIds[2].Id, Text = "Este cunoscut în România și în lume", IsCorrect = true, Order = 1 },
                    new Answer { QuestionId = questionsWithIds[2].Id, Text = "Este complet necunoscut", IsCorrect = false, Order = 2 },
                    new Answer { QuestionId = questionsWithIds[2].Id, Text = "Nu are nicio importanță", IsCorrect = false, Order = 3 }
                });

                context.SaveChanges();
            }
        }

        // Adaugă badge-uri dacă nu există
        if (!context.Badges.Any())
        {
            context.Badges.AddRange(new List<Badge>
            {
                new Badge
                {
                    Name = "Prima Stea",
                    Description = "Completează primul quiz",
                    IconUrl = "⭐",
                    RequiredPoints = 0,
                    Criteria = "{\"quizzesCompleted\": 1}"
                },
                new Badge
                {
                    Name = "Explorator",
                    Description = "Completează 5 quiz-uri",
                    IconUrl = "🗺️",
                    RequiredPoints = 0,
                    Criteria = "{\"quizzesCompleted\": 5}"
                },
                new Badge
                {
                    Name = "Campion",
                    Description = "Acumulează 500 de puncte",
                    IconUrl = "🏆",
                    RequiredPoints = 500,
                    Criteria = "{\"totalPoints\": 500}"
                }
            });

            context.SaveChanges();
        }
    }
}
