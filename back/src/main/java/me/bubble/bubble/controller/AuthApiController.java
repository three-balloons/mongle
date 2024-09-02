package me.bubble.bubble.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.bubble.bubble.config.jwt.JwtTokenProvider;
import me.bubble.bubble.domain.User;
import me.bubble.bubble.dto.*;
import me.bubble.bubble.service.AuthService;
import me.bubble.bubble.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
public class AuthApiController {
    private final AuthService authService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/api/auth/access")
    public ApiResponse<AccessTokenResponse> getAccessToken(@RequestBody AccessTokenRequest request) {
        if (request.getProvider().equals("KAKAO")) {
            try {
                String[] info = authService.getKakaoOAuthId(request.getCode(), request.getRedirect_uri());

                String accessToken = CheckAndSaveUserAndReturnToken(request.getProvider(), info);
                if (accessToken != null) {
                    AccessTokenResponse accessTokenResponse = new AccessTokenResponse(accessToken);

                    return ApiResponse.<AccessTokenResponse>builder()
                            .code("OK")
                            .message("")
                            .data(accessTokenResponse)
                            .build();
                } else {
                    return ApiResponse.<AccessTokenResponse>builder()
                            .code("INAPPROPRATE_PAYLOAD")
                            .message("부적절한 요청입니다.")
                            .data(null)
                            .build();
                }


            } catch (Exception ex) {
                return ApiResponse.<AccessTokenResponse>builder()
                        .code("INAPPROPRATE_PAYLOAD")
                        .message("부적절한 요청입니다.")
                        .data(null)
                        .build();
            }

        } else if (request.getProvider().equals("GOOGLE")) {
            try {
                String[] info = authService.getGoogleOAuthId(request.getCode(), request.getRedirect_uri());

                String accessToken = CheckAndSaveUserAndReturnToken(request.getProvider(), info);
                if (accessToken != null) {
                    AccessTokenResponse accessTokenResponse = new AccessTokenResponse(accessToken);
                    return ApiResponse.<AccessTokenResponse>builder()
                            .code("OK")
                            .message("")
                            .data(accessTokenResponse)
                            .build();
                } else {
                    return ApiResponse.<AccessTokenResponse>builder()
                            .code("INAPPROPRATE_PAYLOAD")
                            .message("부적절한 요청입니다.")
                            .data(null)
                            .build();
                }



            } catch (Exception ex) {
                return ApiResponse.<AccessTokenResponse>builder()
                        .code("INAPPROPRATE_PAYLOAD")
                        .message("부적절한 요청입니다.")
                        .data(null)
                        .build();
            }


        } else {
            return ApiResponse.<AccessTokenResponse>builder()
                    .code("INAPPROPRATE_PAYLOAD")
                    .message("부적절한 요청입니다.")
                    .data(null)
                    .build();
        }
//        @GetMapping("/auth/logout")
//    public String logout (HttpServletRequest request, HttpServletResponse response) {
//        new SecurityContextLogoutHandler().logout(request, response,
//                SecurityContextHolder.getContext().getAuthentication());
//        return "redirect:/login";
//    }
    }

    private String CheckAndSaveUserAndReturnToken (String provider, String[] info) {
        String oAuthId = info[0];
        String email = info[1];
        String name = info[2];
        Optional<User> userOptional = userService.findUserByOauthId(oAuthId);
        if (userOptional.isPresent()) { //OAuthId로 유저를 발견한 경우
            User user = userOptional.get();

            if (user.getDeletedAt() == null) { // 삭제되지 않은 경우 토큰 새로 생성 후 리턴
                return jwtTokenProvider.generateToken(oAuthId);
            } else {
                return null;
            }
        } else {
            User createdUser = userService.createUser(oAuthId, provider, email, name, null, null);
            return jwtTokenProvider.generateToken(oAuthId);
        }
    }
}
