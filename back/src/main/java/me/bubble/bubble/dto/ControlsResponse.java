package me.bubble.bubble.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.bubble.bubble.domain.Controls;

@Getter
@Setter
public class ControlsResponse {
    private final int x;
    private final int y;
    private final boolean visible;

    public ControlsResponse(Controls control) {
        this.x = control.getX();
        this.y = control.getY();
        this.visible = control.isVisible();
    }

    @JsonCreator
    public ControlsResponse(@JsonProperty("x") int x, @JsonProperty("y") int y, @JsonProperty("isVisible") boolean visible) {
        this.x = x;
        this.y = y;
        this.visible = visible;
    }
}
