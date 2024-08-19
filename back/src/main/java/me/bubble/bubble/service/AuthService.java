package me.bubble.bubble.service;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.dto.KakaoResponseDto;
import org.springframework.boot.json.BasicJsonParser;
import org.springframework.boot.json.JsonParser;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Base64;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final WebClient.Builder webClientBuilder;
    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;
    Base64.Decoder decoder = Base64.getDecoder();
    JsonParser jsonParser = new BasicJsonParser();

    public String getKakaoOAuthId(String code, String redirectUri) {
        WebClient webClient = webClientBuilder.build();
        Mono<KakaoResponseDto> kakaoResponseDtoMono = webClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                .bodyValue("grant_type=authorization_code&client_id="+clientId+"&redirect_uri="+redirectUri+"&code=" + code+"&client_secret="+clientSecret)
                .retrieve()
                .bodyToMono(KakaoResponseDto.class);
        //요청을 받아서, idToken을 decode 후에 sub을 가져온다.sub: 유저 식별자
        String idToken = kakaoResponseDtoMono.block().getId_token();
        final String payloadJWT = idToken.split("\\.")[1];
        byte[] payload = decoder.decode(payloadJWT);
        String decodedPayload = new String(payload);
        Map<String, Object> jsonArray = jsonParser.parseMap(decodedPayload);
        if (!jsonArray.containsKey("sub")) {
            return ""; //Exception Handling
        }
        return jsonArray.get("sub").toString();
    }
}
