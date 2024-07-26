package me.bubble.bubble.controller;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Bubble;
import me.bubble.bubble.domain.Controls;
import me.bubble.bubble.domain.Curve;
import me.bubble.bubble.domain.Workspace;
import me.bubble.bubble.dto.*;
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
    public ApiResponse<BubbleGetResponse> findBubblesFromWorkspace (@PathVariable String workspaceName,
                                                                    @RequestParam(required = true) String path,
                                                                    @RequestParam(required = false, defaultValue = "1") int depth) {
        if (depth < 1 || depth > 5) {
            List<BubbleGetResponse> data = new ArrayList<>();
            return ApiResponse.<BubbleGetResponse>builder()
                    .code("Inappropriate depth")
                    .message("깊이가 부적절합니다.")
                    .data(data)
                    .build();
        } else {
            Workspace workspace = workspaceService.findByName(workspaceName);
            Long workspaceId = workspace.getId();

            Bubble bubble = bubbleService.findByPathAndWorkspaceId(path, workspaceId);
            List<BubbleGetResponse> bubbleGetResponses = buildBubbleResponseList(bubble, depth, workspaceId);

            return ApiResponse.<BubbleGetResponse>builder()
                    .code("OK")
                    .message("")
                    .data(bubbleGetResponses)
                    .build();
        }
    }

    @DeleteMapping("/api/bubble/{workspaceName}")
    public ApiResponse<BubbleGetResponse> deleteBubbleFromWorkspace(@PathVariable String workspaceName,
                                                                    @RequestParam(required = true) String path){
        Workspace workspace = workspaceService.findByName(workspaceName);
        Long workspaceId = workspace.getId();
        bubbleService.deleteByPathStartingWithAndWorkspaceId(path, workspaceId);
        List<BubbleGetResponse> data = new ArrayList<>();
        return ApiResponse.<BubbleGetResponse>builder()
                .code("OK")
                .message("")
                .data(data)
                .build();
    }

    @GetMapping("/api/bubble/tree/{workspaceName}")
    // <?>: 어떤 자료형의 객체도 매개변수로 받겠다는 의미
    public ApiResponse<?> getBubbleTreeFromWorkspace(@PathVariable String workspaceName,
                                                     @RequestParam(required = false, defaultValue = "/") String path,
                                                     @RequestParam(required = false, defaultValue = "-1") int depth)
    // RequestedParam 내부에는 정적이 값이 들어가야해서 음수로 설정 후 밑에서 음수일 경우 기본값을 바꿔주는 형식으로 구현
    {
        Workspace workspace = workspaceService.findByName(workspaceName);
        Long workspaceId = workspace.getId();

        if (depth < -1) {
            List<BubbleTreeResponse> data = new ArrayList<>();
            return ApiResponse.<BubbleTreeResponse>builder()
                    .code("Inappropriate depth")
                    .message("깊이가 부적절합니다.")
                    .data(data)
                    .build();
        } else if (depth == -1) { // depth 기본값을 pathDepth의 최대값으로
            depth = bubbleService.getMaxPathDepth(workspaceId).getPathDepth();
        }

        // 응답 객체 만드는 과정
        if (!path.equals("/")) { //특정 path로 요청했을 경우
            Bubble bubble = bubbleService.findByPathAndWorkspaceId(path, workspaceId); //해당 workspace의 특정 path에 해당하는 bubble 찾는다.

            //그 bubble에 대한 응답 객체 생성
            List<BubbleTreeResponse> bubbleTreeResponses = buildBubbleTreeResponseList(bubble, depth, workspaceId);

            return ApiResponse.<BubbleTreeResponse>builder()
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
            return ApiResponse.<List<BubbleTreeResponse>>builder()
                    .code("OK")
                    .message("기본 path('/')로의 요청")
                    .data(bubbleTreeResponses)
                    .build();
        }
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

    private List<BubbleGetResponse> buildBubbleResponseList(Bubble bubble, int depth, Long workspaceId) {
        if (depth == 0 || bubble == null) {
            return Collections.emptyList();
        }

        List<BubbleGetResponse> bubbleGetResponses = new ArrayList<>();
        bubbleGetResponses.add(buildBubbleResponse(bubble, depth, workspaceId));

        return bubbleGetResponses;
    }

    private BubbleGetResponse buildBubbleResponse(Bubble bubble, int depth, Long workspaceId) {
        if (depth == 0 || bubble == null) {
            return new BubbleGetResponse(bubble, Collections.emptyList(), Collections.emptyList());
        }

        List<BubbleGetResponse> childrenResponses = new ArrayList<>();
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
        return new BubbleGetResponse(bubble, childrenResponses, curveResponses);
    }
}
