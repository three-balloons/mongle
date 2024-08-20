package me.bubble.bubble.service;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.dto.OAuthResponseDto;
import org.springframework.boot.json.BasicJsonParser;
import org.springframework.boot.json.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Base64;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final WebClient.Builder webClientBuilder;
    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    Base64.Decoder decoder = Base64.getDecoder();
    JsonParser jsonParser = new BasicJsonParser();
    public String getKakaoOAuthId(String code, String redirectUri) {
        WebClient webClient = webClientBuilder.build();
        Mono<OAuthResponseDto> kakaoResponseDtoMono = webClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                .bodyValue("grant_type=authorization_code&client_id="+kakaoClientId+"&redirect_uri="+redirectUri+"&code=" + code+"&client_secret="+kakaoClientSecret)
                .retrieve()
                .bodyToMono(OAuthResponseDto.class);
        //요청을 받아서, idToken을 decode 후에 sub을 가져온다.sub: 유저 식별자
        String idToken = kakaoResponseDtoMono.block().getId_token();
        return getOAuthIdFromIdToken(idToken);
    }

    public String getGoogleOAuthId(String code, String redirectUri) {
        WebClient webClient = webClientBuilder.build();
        Mono<OAuthResponseDto> googleResponseDtoMono = webClient.post()
                .uri("https://oauth2.googleapis.com/token")
                .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                .bodyValue("code=" + code + "&client_id=" + googleClientId + "&client_secret=" + googleClientSecret + "&redirect_uri=" + redirectUri + "&grant_type=authorization_code")
                .retrieve()
                .bodyToMono(OAuthResponseDto.class);

        String idToken = googleResponseDtoMono.block().getId_token();
        return getOAuthIdFromIdToken(idToken);

    }
    private String getOAuthIdFromIdToken(String idToken) {
        final String payloadJwt = idToken.split("\\.")[1];
        byte[] payload = decoder.decode(payloadJwt);
        String decodedPayload = new String(payload);
        Map<String, Object> jsonArray = jsonParser.parseMap(decodedPayload);
        if (!jsonArray.containsKey("sub")) {
            throw new RuntimeException("ID token does not contain 'sub' field");
        }
        return jsonArray.get("sub").toString();
    }
}
