package com.urbaneye.controller;

import com.urbaneye.dto.VoiceQueryRequest;
import com.urbaneye.dto.VoiceQueryResponse;
import com.urbaneye.service.VoiceAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/voice")
public class VoiceAssistantController {

    private final VoiceAssistantService voiceAssistantService;

    public VoiceAssistantController(VoiceAssistantService voiceAssistantService) {
        this.voiceAssistantService = voiceAssistantService;
    }

    @PostMapping("/query")
    public ResponseEntity<VoiceQueryResponse> processVoiceQuery(@RequestBody VoiceQueryRequest request) {
        return ResponseEntity.ok(voiceAssistantService.processQuery(request));
    }
}
