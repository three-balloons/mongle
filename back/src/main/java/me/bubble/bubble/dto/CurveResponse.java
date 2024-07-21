package me.bubble.bubble.dto;

import lombok.Getter;
import me.bubble.bubble.domain.Curve;

@Getter
public class CurveResponse {
    private final int red;
    private final int green;
    private final int blue;
    private final int alpha;
    private final int b_width;
    private final int b_height;
    private final int b_top;
    private final int b_left;
    private final String path;
    private final int thickness;

    public CurveResponse(Curve curve) {
        this.red = curve.getRed();
        this.green = curve.getGreen();
        this.blue = curve.getBlue();
        this.alpha = curve.getAlpha();
        this.b_width = curve.getB_width();
        this.b_height = curve.getB_height();
        this.b_top = curve.getB_top();
        this.b_left = curve.getB_left();
        this.path = curve.getPath();
        this.thickness = curve.getThickness();
    }
}