package me.bubble.bubble.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class JwtTokenProvider {
    private final JwtProperties jwtProperties;
    private final long JWT_EXPIRATION = 86400000L; // 1일

    public String generateToken(String oauthId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setIssuer(jwtProperties.getIssuer())
                .claim("oauthId", oauthId)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtProperties.getSecretKey())
                .compact();
    }

    // JWT 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey())
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // JWT 토큰에서 인증 정보 추출
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtProperties.getSecretKey())
                .parseClaimsJws(token)
                .getBody();

        String oauthId = claims.get("oauthId", String.class);

        // SimpleGrantedAuthority를 사용하여 역할을 추가할 수 있지만, 이 예제에서는 기본적으로 권한을 추가하지 않음
        User principal = new User(oauthId, "", Collections.emptyList());

        return new UsernamePasswordAuthenticationToken(principal, token, Collections.emptyList());
    }

    // 요청에서 JWT 토큰 추출
    public Optional<String> extractAccessToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return Optional.of(bearerToken.substring(7)); // Remove "Bearer " prefix
        }
        return Optional.empty();
    }
}

