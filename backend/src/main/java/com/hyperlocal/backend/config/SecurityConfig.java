package com.hyperlocal.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Crucial for POST requests from React
                .cors(Customizer.withDefaults()) // Activates your @CrossOrigin(origins = "*")
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Allows access to /api/users/login
                );

        return http.build();
    }
}
