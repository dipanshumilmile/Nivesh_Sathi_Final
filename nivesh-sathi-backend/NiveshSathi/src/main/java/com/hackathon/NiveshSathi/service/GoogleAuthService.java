package com.hackathon.NiveshSathi.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.hackathon.NiveshSathi.dto.AuthResponse;
import com.hackathon.NiveshSathi.dto.GoogleLoginRequest;
import com.hackathon.NiveshSathi.entity.User;
import com.hackathon.NiveshSathi.enums.AuthProvider;
import com.hackathon.NiveshSathi.repository.UserRepository;
import com.hackathon.NiveshSathi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleAuthService {

    @Value("${google.client.id}")
    private String googleClientId;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public GoogleAuthService(UserRepository userRepository,
                             BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) throws Exception {
        String idTokenString = request.getIdToken();

        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        GsonFactory.getDefaultInstance())
                        .setAudience(Collections.singletonList(googleClientId))
                        .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken == null) {
            throw new RuntimeException("Invalid Google Token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            user = new User();

            user.setName(name);
            user.setEmail(email);

            user.setPassword(
                    encoder.encode(UUID.randomUUID().toString())
            );

            user.setProfession(request.getProfession());
            user.setProvider(AuthProvider.GOOGLE);

            user = userRepository.save(user);
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