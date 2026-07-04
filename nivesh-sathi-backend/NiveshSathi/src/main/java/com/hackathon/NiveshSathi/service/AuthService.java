package com.hackathon.NiveshSathi.service;

import com.hackathon.NiveshSathi.dto.AuthResponse;
import com.hackathon.NiveshSathi.dto.LoginRequest;
import com.hackathon.NiveshSathi.dto.SignupRequest;
import com.hackathon.NiveshSathi.entity.User;
import com.hackathon.NiveshSathi.enums.AuthProvider;
import com.hackathon.NiveshSathi.repository.UserRepository;
import com.hackathon.NiveshSathi.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public User signup(SignupRequest request) {

        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(encoder.encode(request.password));
        user.setProfession(request.profession);
        user.setProvider(AuthProvider.LOCAL);

        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = JwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getProfession()

        );
    }
}