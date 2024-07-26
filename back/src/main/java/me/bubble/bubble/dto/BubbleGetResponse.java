package me.bubble.bubble.dto;

import lombok.Getter;
import me.bubble.bubble.domain.Bubble;

import java.util.Collections;
import java.util.List;

@Getter
public class BubbleGetResponse {
    private final String path;
    private final int top;
    private final int left;
    private final int width;
    private final int height;
    private final List<CurveResponse> curves;
    private final List<BubbleGetResponse> children;

    public BubbleGetResponse(Bubble bubble, List<BubbleGetResponse> children, List<CurveResponse> curves) {
        this.path = bubble.getPath();
        this.top = bubble.getTop();
        this.left = bubble.getLeftmost();
        this.width = bubble.getWidth();
        this.height = bubble.getHeight();
        this.children = children == null ? Collections.emptyList() : Collections.unmodifiableList(children);
        this.curves = curves == null ? Collections.emptyList() : Collections.unmodifiableList(curves);
    }
}
