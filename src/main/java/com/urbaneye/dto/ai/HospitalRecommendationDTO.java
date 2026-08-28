package com.urbaneye.dto.ai;

import java.util.ArrayList;
import java.util.List;

public class HospitalRecommendationDTO {

    private String                recommendedHospitalName;
    private String                summaryReason;
    private List<HospitalOptionDTO> hospitalOptions = new ArrayList<>();

    public HospitalRecommendationDTO() {}

    public HospitalRecommendationDTO(String recommendedHospitalName, String summaryReason, List<HospitalOptionDTO> hospitalOptions) {
        this.recommendedHospitalName = recommendedHospitalName;
        this.summaryReason          = summaryReason;
        this.hospitalOptions        = hospitalOptions;
    }

    public String                getRecommendedHospitalName() { return recommendedHospitalName; }
    public String                getSummaryReason()          { return summaryReason; }
    public List<HospitalOptionDTO> getHospitalOptions()        { return hospitalOptions; }
}
