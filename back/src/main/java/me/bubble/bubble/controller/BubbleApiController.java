package me.bubble.bubble.controller;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Bubble;
import me.bubble.bubble.domain.Curve;
import me.bubble.bubble.dto.ApiResponse;
import me.bubble.bubble.dto.BubbleResponse;
import me.bubble.bubble.dto.CurveResponse;
import me.bubble.bubble.service.BubbleService;
import me.bubble.bubble.service.CurveService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor // 빈 자동 주입 (final이 붙거나 @NotNull이 붙은 필드 대상) (생성자 주입)
@RestController //HTTP Response Body의 객체 데이터를 JSON 형식으로 반환
public class BubbleApiController {
    private final BubbleService bubbleService;
    private final CurveService curveService;

    @GetMapping("/api/bubble/{workspace}")
    public ApiResponse<BubbleResponse> findBubblesFromWorkspace (@PathVariable String workspace,
                                                                 @RequestParam(required = false, defaultValue = "1") int depth) {
        if (depth < 1 || depth > 5) {
            List<BubbleResponse> data = new ArrayList<>();
            return ApiResponse.<BubbleResponse>builder()
                    .code("Inappropriate depth")
                    .message("깊이가 부적절합니다.")
                    .data(data)
                    .build();
        } else {
            Bubble bubble = bubbleService.findByPath(workspace);
            List<BubbleResponse> bubbleResponses = buildBubbleResponseList(bubble, depth);

            return ApiResponse.<BubbleResponse>builder()
                    .code("OK")
                    .message("")
                    .data(bubbleResponses)
                    .build();
        }
    }

    @DeleteMapping("/api/bubble/{workspace}")
    public ApiResponse<BubbleResponse> deleteBubbleFromWorkspace(@PathVariable String workspace){
        bubbleService.deleteByPath(workspace);
        List<BubbleResponse> data = new ArrayList<>();
        return ApiResponse.<BubbleResponse>builder()
                .code("OK")
                .message("")
                .data(data)
                .build();
    }

    private List<BubbleResponse> buildBubbleResponseList(Bubble bubble, int depth) {
        if (depth == 0 || bubble == null) {
            return Collections.emptyList();
        }

        List<BubbleResponse> bubbleResponses = new ArrayList<>();
        bubbleResponses.add(buildBubbleResponse(bubble, depth));

        return bubbleResponses;
    }

    private BubbleResponse buildBubbleResponse(Bubble bubble, int depth) {
        if (depth == 0 || bubble == null) {
            return new BubbleResponse(bubble, Collections.emptyList(), Collections.emptyList());
        }

        List<BubbleResponse> childrenResponses = new ArrayList<>();
        for (Bubble child : bubbleService.findChildrenByBubble(bubble)) {
            childrenResponses.add(buildBubbleResponse(child, depth - 1));
        }

        List<CurveResponse> curveResponses = new ArrayList<>();
        for (Curve curve : curveService.findCurvesByBubble(bubble)) {
            curveResponses.add(new CurveResponse(curve));
        }

        return new BubbleResponse(bubble, childrenResponses, curveResponses);
    }



}
