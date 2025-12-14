using RoVia.API.Models;

namespace RoVia.API.DTOs;

public class AttractionDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public AttractionType Type { get; set; }
    public string TypeName { get; set; }
    public string Region { get; set; }
    public string ImageUrl { get; set; }
    public double Rating { get; set; }
}

public class AttractionFilterRequest
{
    public AttractionType? Type { get; set; }
    public string? Region { get; set; }
    public double? MinRating { get; set; }
}
