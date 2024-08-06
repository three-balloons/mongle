package me.bubble.bubble.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.Getter;
import lombok.Setter;
import me.bubble.bubble.domain.Curve;

import java.util.List;

@Getter
@Setter
@JsonAutoDetect
public class CurveResponse {
    private final List<ControlsResponse> position;
    private final String path;
    private final Config config;

    public CurveResponse(Curve curve, List<ControlsResponse> position) {
        this.position = position;
        if (curve != null) {
            this.path = curve.getPath();
            this.config = new Config(curve.getColor(), curve.getThickness());
        }
        else {
            this.path = ""; // 또는 적절한 기본 값
            this.config = new Config("", 0); // 또는 적절한 기본 값으로 초기화
        }
    }

}