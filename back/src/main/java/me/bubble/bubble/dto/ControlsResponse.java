package me.bubble.bubble.dto;

import lombok.Getter;
import me.bubble.bubble.domain.Controls;

@Getter
public class ControlsResponse {
    private final int x;
    private final int y;

    public ControlsResponse(Controls control) {
        this.x = control.getX();
        this.y = control.getY();
    }
}
