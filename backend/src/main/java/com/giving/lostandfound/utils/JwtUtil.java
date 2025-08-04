package com.giving.lostandfound.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private Duration jwtExpiration;
    private Algorithm algorithm;
    private JWTVerifier verifier;

    @PostConstruct
    public void init() {
        this.algorithm = Algorithm.HMAC256(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.verifier = JWT.require(algorithm).build();
    }

    public String generateToken(Long userId, String email, String firstName, String lastName, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpiration.toMillis());

        return JWT.create()
                .withSubject(userId.toString())
                .withClaim("email", email)
                .withClaim("firstName", firstName)
                .withClaim("lastName", lastName)
                .withClaim("role", role)
                .withIssuedAt(now)
                .withExpiresAt(expiry)
                .sign(algorithm);
    }

    public Long getIdFromToken(String token) {
        return Long.valueOf(decodeToken(token).getSubject());
    }

    public String getEmailFromToken(String token) {
        return decodeToken(token).getClaim("email").asString();
    }

    public String getFirstNameFromToken(String token) {
        return decodeToken(token).getClaim("firstName").asString();
    }

    public String getLastNameFromToken(String token) {
        return decodeToken(token).getClaim("lastName").asString();
    }

    public String getRoleFromToken(String token) {
        return decodeToken(token).getClaim("role").asString();
    }


    public boolean validateToken(String token) {
        try {
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    private DecodedJWT decodeToken(String token) {
        return verifier.verify(token);
    }
}
