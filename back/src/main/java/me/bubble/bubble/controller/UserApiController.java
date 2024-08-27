package me.bubble.bubble.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import me.bubble.bubble.dto.*;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.User;
import me.bubble.bubble.dto.BubbleResponse;
import me.bubble.bubble.dto.GetUserResponse;
import me.bubble.bubble.service.UserService;
import me.bubble.bubble.util.SecurityUtil;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
public class UserApiController {
    private final UserService userService;

    @GetMapping("/api/user")
    @Operation(summary = "유저 정보 가져오기", description = "유저 정보 가져오기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(USER_NOT_FOUND)", description = "code: \"USER_NOT_FOUND\", message: \"유저가 존재하지 않습니다.\"", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<GetUserResponse> getUser() {
        try {
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            Optional<User> user = userService.findUserByOauthId(oAuthId);
            if (user.isEmpty()) {
                throw new IllegalStateException("User Not Found");
            }
            GetUserResponse response = new GetUserResponse(user.get());

            return ApiResponse.<GetUserResponse>builder()
                    .code("OK")
                    .message("")
                    .data(response)
                    .build();
        } catch (RuntimeException ex) {
            return ApiResponse.<GetUserResponse>builder()
                    .code("USER_NOT_FOUND")
                    .message("유저가 존재하지 않습니다.")
                    .data(null)
                    .build();
        }

    }

    @PutMapping("/api/user")
    @Operation(summary = "유저 정보 수정하기", description = "유저 정보 수정하기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(USER_NOT_FOUND)", description = "code: \"USER_NOT_FOUND\", message: \"유저가 존재하지 않습니다.\"", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<GetUserResponse> putUser(@RequestBody PutUserRequest request) {
        try {
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            User user = userService.updateUserNameAndEmail(oAuthId, request.getName(), request.getEmail());
            GetUserResponse response = new GetUserResponse(user);
            return ApiResponse.<GetUserResponse>builder()
                    .code("OK")
                    .message("")
                    .data(response)
                    .build();
        } catch (RuntimeException ex) {
            return ApiResponse.<GetUserResponse>builder()
                    .code("USER_NOT_FOUND")
                    .message("유저가 존재하지 않습니다.")
                    .data(null)
                    .build();
        }

    }

    @DeleteMapping("/api/user")
    @Operation(summary = "유저 삭제 업데이트하기", description = "유저 deletedAt 업데이트하기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(USER_NOT_FOUND)", description = "code: \"USER_NOT_FOUND\", message: \"유저가 존재하지 않습니다.\"", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<StatusResponse> deleteUser() {
        try {
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            userService.updateDeletedAtByOauthId(oAuthId);

            StatusResponse statusResponse = new StatusResponse("DELETED");
            return ApiResponse.<StatusResponse>builder()
                    .code("OK")
                    .message("")
                    .data(statusResponse)
                    .build();
        } catch (RuntimeException ex) {
            return ApiResponse.<StatusResponse>builder()
                    .code("USER_NOT_FOUND")
                    .message("유저가 존재하지 않습니다.")
                    .data(null)
                    .build();
        }
    }
}
