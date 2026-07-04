package com.hackathon.NiveshSathi.controller;

import com.hackathon.NiveshSathi.dto.AuthResponse;
import com.hackathon.NiveshSathi.dto.LoginRequest;
import com.hackathon.NiveshSathi.dto.SignupRequest;
import com.hackathon.NiveshSathi.entity.User;
import com.hackathon.NiveshSathi.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.hackathon.NiveshSathi.dto.GoogleLoginRequest;
import com.hackathon.NiveshSathi.service.GoogleAuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "https://nivesh-sathi-frontend.vercel.app"
        },
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)


public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;

    public AuthController(AuthService authService,
                          GoogleAuthService googleAuthService) {
        this.authService = authService;
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public AuthResponse googleLogin(@RequestBody GoogleLoginRequest request) throws Exception {
        return googleAuthService.loginWithGoogle(request);
    }
}
