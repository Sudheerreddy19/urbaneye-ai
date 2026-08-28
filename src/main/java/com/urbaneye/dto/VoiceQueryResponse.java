package com.urbaneye.dto;

public class VoiceQueryResponse {

    private String intent;             // e.g. "BUS_LOCATION", "WATERLOGGING", "WEATHER"
    private String spokenResponse;     // Text for Web Speech TTS synthesis
    private String actionDirective;    // "FOCUS_BUS", "SHOW_WATERLOGGING_LAYER", "SHOW_HOSPITALS"
    private Object data;               // Structured payload for UI cards

    public VoiceQueryResponse() {}

    public VoiceQueryResponse(String intent, String spokenResponse, String actionDirective, Object data) {
        this.intent          = intent;
        this.spokenResponse  = spokenResponse;
        this.actionDirective = actionDirective;
        this.data            = data;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String intent, spokenResponse, actionDirective;
        private Object data;

        public Builder intent(String v)          { this.intent          = v; return this; }
        public Builder spokenResponse(String v)  { this.spokenResponse  = v; return this; }
        public Builder actionDirective(String v) { this.actionDirective = v; return this; }
        public Builder data(Object v)            { this.data            = v; return this; }
        public VoiceQueryResponse build()        { return new VoiceQueryResponse(intent, spokenResponse, actionDirective, data); }
    }

    public String getIntent()          { return intent; }
    public String getSpokenResponse()  { return spokenResponse; }
    public String getActionDirective() { return actionDirective; }
    public Object getData()            { return data; }
}
