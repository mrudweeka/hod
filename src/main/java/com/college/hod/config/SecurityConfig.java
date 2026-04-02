package com.college.hod.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/",
                        "/index.html",
                        "/student.html",
                        "/hod.html",
                        "/permission.html",
                        "/request.html",
                        "/myrequest.html",
                        "/certificate.html",
                        "/auth/**",
                        "/student/**",
                        "/hod/**",
                        "/request/**",
                        "/certificate/**",
                        "/notification/**",
                        "/css/**",
                        "/js/**",
                        "/images/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }
}
