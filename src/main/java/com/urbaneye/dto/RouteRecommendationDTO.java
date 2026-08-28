package com.urbaneye.dto;

import java.util.ArrayList;
import java.util.List;

public class RouteRecommendationDTO {

    private String               fromName;
    private String               toName;
    private Double               distanceKm;
    private String               recommendationBadge; // e.g. "⭐ FASTEST OPTION: TWO-WHEELER (21 min)"
    private List<TravelOptionDTO> options = new ArrayList<>();

    public RouteRecommendationDTO() {}

    private RouteRecommendationDTO(Builder b) {
        this.fromName            = b.fromName;
        this.toName              = b.toName;
        this.distanceKm          = b.distanceKm;
        this.recommendationBadge = b.recommendationBadge;
        if (b.options != null) {
            this.options = b.options;
        }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String               fromName, toName, recommendationBadge;
        private Double               distanceKm;
        private List<TravelOptionDTO> options = new ArrayList<>();

        public Builder fromName(String v)           { this.fromName            = v; return this; }
        public Builder toName(String v)             { this.toName              = v; return this; }
        public Builder distanceKm(Double v)         { this.distanceKm          = v; return this; }
        public Builder recommendationBadge(String v){ this.recommendationBadge = v; return this; }
        public Builder options(List<TravelOptionDTO> v) { this.options         = v; return this; }
        public RouteRecommendationDTO build()       { return new RouteRecommendationDTO(this); }
    }

    public String               getFromName()            { return fromName; }
    public String               getToName()              { return toName; }
    public Double               getDistanceKm()          { return distanceKm; }
    public String               getRecommendationBadge() { return recommendationBadge; }
    public List<TravelOptionDTO> getOptions()             { return options; }
}
