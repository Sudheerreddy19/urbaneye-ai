package com.urbaneye.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/citizen/**",
            "/police/**",
            "/hospital/**"
    })
    public String forwardToFrontend() {
        return "forward:/index.html";
    }
}
