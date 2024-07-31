package me.bubble.bubble.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Bubble;
import me.bubble.bubble.domain.Controls;
import me.bubble.bubble.domain.Curve;
import me.bubble.bubble.domain.Workspace;
import me.bubble.bubble.dto.*;
import me.bubble.bubble.exception.CurveNotFoundException;
import me.bubble.bubble.service.BubbleService;
import me.bubble.bubble.service.ControlsService;
import me.bubble.bubble.service.CurveService;
import me.bubble.bubble.service.WorkspaceService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor // 빈 자동 주입 (final이 붙거나 @NotNull이 붙은 필드 대상) (생성자 주입)
@RestController //HTTP Response Body의 객체 데이터를 JSON 형식으로 반환
public class BubbleApiController {
    private final BubbleService bubbleService;
    private final CurveService curveService;
    private final WorkspaceService workspaceService;
    private final ControlsService controlsService;

    @GetMapping("/api/bubble/{workspaceName}")
    @Operation(summary = "버블에 대한 정보 가져오기", description = "해당 버블과 그 버블에 포함된 버블, 커브 가져오기 (depth만큼)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200(Inappropriate depth)", description = "code: \"Inappropriate depth\", message: \"깊이가 부적절합니다.\"", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\" ", content = @Content(mediaType = "application/json"))
    })
    @Parameters({
            @Parameter(name = "path", description = "버블의 path (필수)", example = "/ws1/A", required = true),
            @Parameter(name = "depth", description = "탐색을 원하는 깊이 (선택, default = 1, 1~5 사이)", example = "3"),
    })
    public ApiResponse_1<BubbleResponse> findBubblesFromWorkspace (@PathVariable String workspaceName,
                                                                   @RequestParam(required = true) String path,
                                                                   @RequestParam(required = false, defaultValue = "1") int depth) {
        if (depth < 1 || depth > 5) {
            return ApiResponse_1.<BubbleResponse>builder()
                    .code("Inappropriate depth")
                    .message("깊이가 부적절합니다.")
                    .data(null)
                    .build();
        } else {
            Workspace workspace = workspaceService.findByName(workspaceName);
            Long workspaceId = workspace.getId();

            Bubble bubble = bubbleService.findByPathAndWorkspaceId(path, workspaceId);
            List<BubbleResponse> bubbleResponse = buildBubbleResponseList(bubble, depth, workspaceId);

            return ApiResponse_1.<BubbleResponse>builder()
                    .code("OK")
                    .message("")
                    .data(bubbleResponse)
                    .build();
        }
    }

    @DeleteMapping("/api/bubble/{workspaceName}")
    @Operation(summary = "버블 삭제하기", description = "버블과 그 버블에 포함된 버블, 커브 삭제하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200(OK)", description = "code: \"OK\"", content = @Content(mediaType = "application/json"))
    })
    @Parameters({
            @Parameter(name = "path", description = "버블의 path (필수)", example = "/ws1/A", required = true)
    })
    public ApiResponse_1<BubbleResponse> deleteBubbleFromWorkspace(@PathVariable String workspaceName,
                                                                   @RequestParam(required = true) String path){
        Workspace workspace = workspaceService.findByName(workspaceName);
        Long workspaceId = workspace.getId();
        bubbleService.deleteByPathStartingWithAndWorkspaceId(path, workspaceId);
        return ApiResponse_1.<BubbleResponse>builder()
                .code("OK")
                .message("")
                .data(null)
                .build();
    }

    @GetMapping("/api/bubble/tree/{workspaceName}")
    @Operation(summary = "버블 트리 가져오기", description = "Workspace 내의 bubble 트리 구조 가져오기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200(Inappropriate depth)", description = "code: \"Inappropriate depth\", message: \"깊이가 부적절합니다.\"", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "200(OK_1)", description = "code: \"OK\", message: \"특정 path로의 요청\"", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "200(OK_2)", description = "code: \"OK\", message: \"기본 path('/')로의 요청\"", content = @Content(mediaType = "application/json"))
    })
    @Parameters({
            @Parameter(name = "path", description = "버블의 path (선택, path가 없을 시 workspace 내 전체 트리 반환)", example = "/ws1/A"),
            @Parameter(name = "depth", description = "탐색을 원하는 깊이 (선택, default = -1 (선택, 최대 깊이로 계산해서 반환)", example = "3"),
    })
    // <?>: 어떤 자료형의 객체도 매개변수로 받겠다는 의미
    public ApiResponse_1<?> getBubbleTreeFromWorkspace(@PathVariable String workspaceName,
                                                       @RequestParam(required = false, defaultValue = "/") String path,
                                                       @RequestParam(required = false, defaultValue = "-1") int depth)
    // RequestedParam 내부에는 정적이 값이 들어가야해서 음수로 설정 후 밑에서 음수일 경우 기본값을 바꿔주는 형식으로 구현
    {
        Workspace workspace = workspaceService.findByName(workspaceName);
        Long workspaceId = workspace.getId();

        if (depth < -1) {
            return ApiResponse_1.<BubbleTreeResponse>builder()
                    .code("Inappropriate depth")
                    .message("깊이가 부적절합니다.")
                    .data(null)
                    .build();
        } else if (depth == -1) { // depth 기본값을 pathDepth의 최대값으로
            depth = bubbleService.getMaxPathDepth(workspaceId).getPathDepth();
        }

        // 응답 객체 만드는 과정
        if (!path.equals("/")) { //특정 path로 요청했을 경우
            Bubble bubble = bubbleService.findByPathAndWorkspaceId(path, workspaceId); //해당 workspace의 특정 path에 해당하는 bubble 찾는다.

            //그 bubble에 대한 응답 객체 생성
            List<BubbleTreeResponse> bubbleTreeResponses = buildBubbleTreeResponseList(bubble, depth, workspaceId);

            return ApiResponse_1.<BubbleTreeResponse>builder()
                    .code("OK")
                    .message("특정 path로의 요청")
                    .data(bubbleTreeResponses)
                    .build();
        } else{ // 기본 path로의 요청
            //pathDepth가 1인 버블 객체를 가져온 후
            List<Bubble> bubbles = bubbleService.findBubblesByPathDepthAndWorkspaceId(1, workspaceId);
            List<List<BubbleTreeResponse>> bubbleTreeResponses = new ArrayList<>();

            for (Bubble bubble: bubbles) {
                //그 버블들에 대한 응답 객체를 만든다.
                bubbleTreeResponses.add(buildBubbleTreeResponseList(bubble, depth, workspaceId));
            }
            return ApiResponse_1.<List<BubbleTreeResponse>>builder()
                    .code("OK")
                    .message("기본 path('/')로의 요청")
                    .data(bubbleTreeResponses)
                    .build();
        }
    }

    @PostMapping("/api/bubble/{workspaceName}")
    @Operation(summary = "버블 생성하기", description = "버블 생성하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200(Bad Request)", description = "code: \"Bad Request\", message: \"잘못된 path.\"", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "200(Already Exist)", description = "code: \"Already Exist.\", message: \"이미 존재하는 버블입니다.\"", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "200(No Parent)", description = "code: \"No Parent\", message: \"부모 버블이 존재하지 않습니다.\"", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "200(OK)", description = "code: \"OK\", message: \"\"", content = @Content(mediaType = "application/json"))
    })
    @Parameters({
            @Parameter(name = "path", description = "버블의 path (필수)", example = "/ws1/A", required = true)
    })
    public ApiResponse_2<BubbleResponse> AddBubble (@PathVariable String workspaceName,
                                                      @RequestParam(required = true) String path,
                                                      @RequestBody BubbleAddRequest request) {
        // 해당 workspace 가져온다.
        Workspace workspace = workspaceService.findByName(workspaceName);
        Long workspaceId = workspace.getId();
        if (path.lastIndexOf('/') == -1 || path.endsWith("/")) { // request의 path가 hhh같은 경우와 /로 끝나는 경우
            return ApiResponse_2.<BubbleResponse>builder()
                    .code("Bad Request.")
                    .message("잘못된 path.")
                    .data(null)
                    .build();
        }
        String tempString = path.substring(0, path.lastIndexOf('/')); //path 파싱해서 마지막 / 전까지 문자열 가져온다.

        if (tempString.isEmpty()) { // /ws1 이런 식으로 위의 부모가 없는 버블일 경우.
            try { //예외처리 (이미 존재하는 버블일 경우), 그렇지 않으면 새로운 버블 생성
                Bubble existingBubble = bubbleService.findByPathAndWorkspaceId(path, workspaceId);
                return ApiResponse_2.<BubbleResponse>builder()
                        .code("Already Exist.")
                        .message("이미 존재하는 버블입니다.")
                        .data(null)
                        .build();
            } catch (IllegalArgumentException ex) {
                // 버블이 존재하지 않는 경우 새로운 버블을 생성
                Bubble bubble = Bubble.builder()
                        .top(request.getTop())
                        .leftmost(request.getLeft())
                        .width(request.getWidth())
                        .height(request.getHeight())
                        .path(path)
                        .pathDepth(1)
                        .workspace(workspace)
                        .visible(true)
                        .bubblized(false)
                        .build();

                Bubble savedBubble = bubbleService.saveBubble(bubble);

                BubbleResponse bubbleResponse = new BubbleResponse(savedBubble, null, null);
                return ApiResponse_2.<BubbleResponse>builder()
                        .code("OK")
                        .message("")
                        .data(bubbleResponse)
                        .build();
            }
        }
        else{
            try { //예외처리 (부모가 없는 경우)
                Bubble parentBubble = bubbleService.findByPathAndWorkspaceId(tempString, workspaceId);

                try { //예외처리 (이미 존재하는 버블일 경우), 그렇지 않으면 새로운 버블 생성
                    Bubble existingBubble = bubbleService.findByPathAndWorkspaceId(path, workspaceId);
                    return ApiResponse_2.<BubbleResponse>builder()
                            .code("Already Exist.")
                            .message("이미 존재하는 버블입니다.")
                            .data(null)
                            .build();
                } catch (IllegalArgumentException ex) {
                    // 버블이 존재하지 않는 경우 새로운 버블을 생성
                    Bubble bubble = Bubble.builder()
                            .top(request.getTop())
                            .leftmost(request.getLeft())
                            .width(request.getWidth())
                            .height(request.getHeight())
                            .path(path)
                            .pathDepth(parentBubble.getPathDepth()+ 1)
                            .workspace(workspace)
                            .visible(true)
                            .bubblized(false)
                            .build();

                    Bubble savedBubble = bubbleService.saveBubble(bubble);

                    BubbleResponse bubbleResponse = new BubbleResponse(savedBubble, null, null);
                    return ApiResponse_2.<BubbleResponse>builder()
                            .code("OK")
                            .message("")
                            .data(bubbleResponse)
                            .build();
                }
            } catch (IllegalArgumentException ex) {
                return ApiResponse_2.<BubbleResponse>builder()
                        .code("No Parent.")
                        .message("부모 버블이 존재하지 않습니다.")
                        .data(null)
                        .build();
            }
        }

    }

    @PutMapping("api/bubble/{workspaceName}") // 추가 개발 필요
    @Operation(summary = "버블 업데이트", description = "버블에 포함된 커브 수정하기")
    public ApiResponse_2<PutResponse> PutBubble (@PathVariable String workspaceName,
                                                    @RequestParam(required = true) String path,
                                                    @RequestBody PutRequest request) {
        List<PutResponseObject> deleteList = new ArrayList<>();
        List<PutResponseObject> updateList = new ArrayList<>();
        List<PutResponseObject> createList = new ArrayList<>();
        for (PutDeleteRequest delete: request.getDelete()) { // curveId로 찾아서 삭제, 없으면 예외처리를 통해서 successYn을 false로
            try {
                curveService.deleteCurveById(delete.getId());
                PutResponseObject putResponseObject = new PutResponseObject(delete.getId(), true);
                deleteList.add(putResponseObject);
            }
            catch (CurveNotFoundException ex) {
                PutResponseObject putResponseObject = new PutResponseObject(delete.getId(), false);
                deleteList.add(putResponseObject);
            }
        }

        return ApiResponse_2.<PutResponse>builder()
                .code("No Parent.")
                .message("부모 버블이 존재하지 않습니다.")
                .data(null)
                .build();
    }


        private List<BubbleTreeResponse> buildBubbleTreeResponseList(Bubble bubble, int depth, Long workspaceId) {
        if (depth == 0 || bubble == null) {
            return Collections.emptyList();
        }

        List<BubbleTreeResponse> bubbleTreeResponses = new ArrayList<>();
        bubbleTreeResponses.add(buildBubbleTreeResponse(bubble, depth, workspaceId));

        return bubbleTreeResponses;
    }

    private BubbleTreeResponse buildBubbleTreeResponse(Bubble bubble, int depth, Long workspaceId) {
        if (depth == 0 || bubble == null) {
            return new BubbleTreeResponse("", Collections.emptyList());
        }

        List<BubbleTreeResponse> childrenResponses = new ArrayList<>();
        for (Bubble child : bubbleService.findChildrenByBubbleAndWorkspaceId(bubble, workspaceId)) {
            childrenResponses.add(buildBubbleTreeResponse(child, depth-1, workspaceId));
        }

        // /기준 마지막 글자 추출
        String tempPath = bubble.getPath();
        int lastSlashIndex = tempPath.lastIndexOf('/');
        tempPath = tempPath.substring(lastSlashIndex + 1);

        return new BubbleTreeResponse(tempPath, childrenResponses);
    }

    private List<BubbleResponse> buildBubbleResponseList(Bubble bubble, int depth, Long workspaceId) {
        if (depth == 0 || bubble == null) {
            return Collections.emptyList();
        }

        List<BubbleResponse> bubbleResponses = new ArrayList<>();
        bubbleResponses.add(buildBubbleResponse(bubble, depth, workspaceId));

        return bubbleResponses;
    }

    private BubbleResponse buildBubbleResponse(Bubble bubble, int depth, Long workspaceId) {
        if (depth == 0 || bubble == null) {
            return new BubbleResponse(bubble, Collections.emptyList(), Collections.emptyList());
        }

        List<BubbleResponse> childrenResponses = new ArrayList<>();
        for (Bubble child : bubbleService.findChildrenByBubbleAndWorkspaceId(bubble, workspaceId)) {
            childrenResponses.add(buildBubbleResponse(child, depth - 1, workspaceId));
        }

        List<CurveResponse> curveResponses = new ArrayList<>();

        for (Curve curve : curveService.findCurvesByBubble(bubble)) {
            List<ControlsResponse> positions = new ArrayList<>();
            for (Controls controls: controlsService.findByCurveId(curve.getId())) {
                positions.add(new ControlsResponse(controls));
            }
            curveResponses.add(new CurveResponse(curve, positions));
        }
        return new BubbleResponse(bubble, childrenResponses, curveResponses);
    }
}
