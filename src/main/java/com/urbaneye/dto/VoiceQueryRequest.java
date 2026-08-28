package com.urbaneye.dto;

public class VoiceQueryRequest {

    private String query;
    private Double userLat;
    private Double userLon;

    public VoiceQueryRequest() {}

    public VoiceQueryRequest(String query, Double userLat, Double userLon) {
        this.query   = query;
        this.userLat = userLat;
        this.userLon = userLon;
    }

    public String getQuery()   { return query; }
    public void   setQuery(String query) { this.query = query; }
    public Double getUserLat() { return userLat; }
    public void   setUserLat(Double userLat) { this.userLat = userLat; }
    public Double getUserLon() { return userLon; }
    public void   setUserLon(Double userLon) { this.userLon = userLon; }
}
