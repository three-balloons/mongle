package me.bubble.bubble.dto;

import lombok.Getter;
import me.bubble.bubble.domain.Bubble;
import me.bubble.bubble.domain.Curve;

import java.util.Collections;
import java.util.List;

@Getter
public class BubbleResponse {
    private final int top;
    private final int leftmost;
    private final int width;
    private final int height;
    private final String path;
    private final List<CurveResponse> curves;
    private final List<BubbleResponse> children;

    public BubbleResponse(Bubble bubble, List<BubbleResponse> children, List<CurveResponse> curves) {
        this.top = bubble.getTop();
        this.leftmost = bubble.getLeftmost();
        this.width = bubble.getWidth();
        this.height = bubble.getHeight();
        this.path = bubble.getPath();
        this.children = children == null ? Collections.emptyList() : Collections.unmodifiableList(children);
        this.curves = curves == null ? Collections.emptyList() : Collections.unmodifiableList(curves);
    }
}
