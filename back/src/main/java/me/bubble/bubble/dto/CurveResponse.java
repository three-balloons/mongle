package me.bubble.bubble.dto;

import lombok.Getter;
import me.bubble.bubble.domain.Curve;

import java.util.List;

@Getter
public class CurveResponse {
    private final List<ControlsResponse> position;
    private final String path;
    private final Config config;

    public CurveResponse(Curve curve, List<ControlsResponse> position) {
        this.position = position;
        this.path = curve.getPath();
        this.config = new Config(curve.getColor(), curve.getThickness());
    }


    @Getter
    public static class Config {
        private final String color;
        private final int thickness;

        public Config(String color, int thickness) {
            this.color = color;
            this.thickness = thickness;
        }
    }

}