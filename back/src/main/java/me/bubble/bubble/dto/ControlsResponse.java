package me.bubble.bubble.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import me.bubble.bubble.domain.Controls;

@Getter
public class ControlsResponse {
    private final int x;
    private final int y;

    @JsonProperty("isVisible")
    private final boolean visible;

    public ControlsResponse(Controls control) {
        this.x = control.getX();
        this.y = control.getY();
        this.visible = control.isVisible();
    }
}
