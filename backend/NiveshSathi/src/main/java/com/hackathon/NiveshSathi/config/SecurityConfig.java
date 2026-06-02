package com.hackathon.NiveshSathi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ✅ ENABLE CORS (modern way)
                .cors(Customizer.withDefaults())

                // ✅ Disable CSRF for APIs
                .csrf(csrf -> csrf.disable())

                // ✅ Authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/ai/**",
                                "/h2/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                // ✅ Needed for H2 console
                .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }
}
