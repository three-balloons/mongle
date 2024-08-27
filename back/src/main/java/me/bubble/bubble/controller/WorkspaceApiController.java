package me.bubble.bubble.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.User;
import me.bubble.bubble.domain.Workspace;
import me.bubble.bubble.dto.ApiResponse;
import me.bubble.bubble.dto.PutWorkspaceRequest;
import me.bubble.bubble.dto.WorkspaceResponse;
import me.bubble.bubble.service.UserService;
import me.bubble.bubble.service.WorkspaceService;
import me.bubble.bubble.util.SecurityUtil;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
public class WorkspaceApiController {
    private final WorkspaceService workspaceService;
    private final UserService userService;

    @GetMapping("api/workspace/{workspaceId}")
    @Operation(summary = "워크스페이스에 대한 정보 가져오기", description = "워크스페이스에 대한 정보 가져오기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(NOT_EXIST)", description = "code: \"NOT_EXIST\", message: \"해당 워크스페이스가 존재하지 않습니다.\"", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<WorkspaceResponse> getWorkspace(@PathVariable UUID workspaceId) {
        try {
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            Workspace workspace = workspaceService.findWorkspaceById(workspaceId);

            if (!oAuthId.equals(workspace.getUser().getOauthId())) {
                throw new IllegalArgumentException("부적절한 유저");
            }

            WorkspaceResponse response = new WorkspaceResponse(workspace);

            return ApiResponse.<WorkspaceResponse>builder()
                    .code("OK")
                    .message("")
                    .data(response)
                    .build();

        } catch (RuntimeException ex){
            return ApiResponse.<WorkspaceResponse>builder()
                    .code("NOT_EXIST")
                    .message("해당 워크스페이스가 존재하지 않습니다.")
                    .data(null)
                    .build();
        }
    }

    @GetMapping("api/workspace")
    @Operation(summary = "워크스페이스에 대한 정보 모두 가져오기", description = "해당 유저에 대한 워크스페이스에 대한 정보 모두 가져오기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<List<WorkspaceResponse>> getWorkspaces() {
        try {
            List<WorkspaceResponse> responseList = new ArrayList<>();
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            Optional<User> user = userService.findUserByOauthId(oAuthId);
            if (user.isEmpty()) {
                throw new IllegalArgumentException("User Not Found");
            }

            List<Workspace> workspaceList = workspaceService.getAllWorkspacesByUser(user.get());

            for (Workspace workspace: workspaceList) {
                responseList.add(new WorkspaceResponse(workspace));
            }

            return ApiResponse.<List<WorkspaceResponse>>builder()
                    .code("OK")
                    .message("")
                    .data(responseList)
                    .build();
        } catch(RuntimeException ex) {
            return ApiResponse.<List<WorkspaceResponse>>builder()
                    .code("USER_NOT_FOUND")
                    .message("해당 유저가 존재하지 않습니다.")
                    .data(null)
                    .build();
        }

    }

    @PutMapping("api/workspace/{workspaceId}")
    @Operation(summary = "워크스페이스에 대한 정보 수정하기", description = "워크스페이스 정보 수정하기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(ALREADY_EXIST)", description = "code: \"ALREADY_EXIST\", message: \"해당 이름의 워크스페이스가 이미 존재합니다.\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<WorkspaceResponse> putWorkspace (@PathVariable UUID workspaceId,
                                                        @RequestBody PutWorkspaceRequest request) {
        try {
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            Workspace workspace = workspaceService.findWorkspaceById(workspaceId);

            Optional<User> user = userService.findUserByOauthId(oAuthId);


            if (!oAuthId.equals(workspace.getUser().getOauthId())) {
                throw new IllegalArgumentException("부적절한 유저");
            }

            if (workspaceService.findByUserAndName(user.get(), request.getName()).isPresent()) {
                return ApiResponse.<WorkspaceResponse>builder()
                        .code("ALREADY_EXIST")
                        .message("해당 이름의 워크스페이스가 이미 존재합니다.")
                        .data(null)
                        .build();
            }
            workspace = workspaceService.updateNameAndTheme(workspace, request.getName(), request.getTheme());

            WorkspaceResponse response = new WorkspaceResponse(workspace);
            return ApiResponse.<WorkspaceResponse>builder()
                    .code("OK")
                    .message("")
                    .data(response)
                    .build();

        } catch (RuntimeException ex) {
            return ApiResponse.<WorkspaceResponse>builder()
                    .code("NOT_EXIST")
                    .message("해당 워크스페이스가 존재하지 않습니다.")
                    .data(null)
                    .build();
        }
    }

    @DeleteMapping("api/workspace/{workspaceId}")
    @Operation(summary = "워크스페이스 삭제하기", description = "워크스페이스 삭제하기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(NOT_EXIST)", description = "code: \"NOT_EXIST\", message: \"해당 워크스페이스가 존재하지 않습니다.\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<Object> deleteWorkspace (@PathVariable UUID workspaceId) {
        try {
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            Workspace workspace = workspaceService.findWorkspaceById(workspaceId);

            if (!oAuthId.equals(workspace.getUser().getOauthId())) {
                throw new IllegalArgumentException("부적절한 유저");
            }

            workspaceService.updateDeletedAt(workspace);
            return ApiResponse.<Object>builder()
                    .code("OK")
                    .message("")
                    .data(null)
                    .build();

        } catch (RuntimeException ex) {
            return ApiResponse.<Object>builder()
                    .code("NOT_EXIST")
                    .message("해당 워크스페이스가 존재하지 않습니다.")
                    .data(null)
                    .build();
        }

    }

    @PostMapping("api/workspace")
    @Operation(summary = "워크스페이스 생성하기", description = "워크스페이스 생성하기")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200(ALREADY_EXIST)", description = "code: \"ALREADY_EXIST\", message: \"해당 이름의 워크스페이스가 이미 존재합니다.\" ", content = @Content(mediaType = "application/json"))
    })
    public ApiResponse<WorkspaceResponse> postWorkspace (@RequestBody PutWorkspaceRequest request) {
        try {
            String oAuthId = SecurityUtil.getCurrentUserOAuthId();
            Optional<User> user = userService.findUserByOauthId(oAuthId);

            if (workspaceService.findByUserAndName(user.get(), request.getName()).isPresent()) {
                return ApiResponse.<WorkspaceResponse>builder()
                        .code("ALREADY_EXIST")
                        .message("해당 이름의 워크스페이스가 이미 존재합니다.")
                        .data(null)
                        .build();
            }

            Workspace workspace = workspaceService.createWorkspace(request.getName(), request.getTheme(), user.get());

            WorkspaceResponse response = new WorkspaceResponse(workspace);

            return ApiResponse.<WorkspaceResponse>builder()
                    .code("OK")
                    .message("")
                    .data(response)
                    .build();

        } catch (RuntimeException ex) {
            return ApiResponse.<WorkspaceResponse>builder()
                    .code("AUTHENTICATION_FAILED")
                    .message("유저 인증 실패하였습니다.")
                    .data(null)
                    .build();
        }

    }
}
