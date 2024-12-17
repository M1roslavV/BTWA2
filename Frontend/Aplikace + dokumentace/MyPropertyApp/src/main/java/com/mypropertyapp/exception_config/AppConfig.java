package com.mypropertyapp.exception_config;

import jakarta.servlet.Filter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        Object AbstractHttpConfigurer = null;
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(req -> req.requestMatchers("/api/users/**")
                .permitAll()
                .anyRequest()
                .authenticated());
        http.exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler));
        http.sessionManagement(session -> session.sessionCreationPolicy(STATELESS));
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(
                authenticationJwtTokenFilter(),
                UsernamePasswordAuthenticationFilter.class
        );
        HttpSecurity httpSecurity = http;

        return http.build();
    }

    private Filter authenticationJwtTokenFilter() {
        return null;
    }

    private AuthenticationProvider authenticationProvider() {
        return null;
    }

    // ...
}