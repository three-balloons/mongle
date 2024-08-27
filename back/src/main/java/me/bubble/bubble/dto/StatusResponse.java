package me.bubble.bubble.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusResponse {
    private final String status;

    public StatusResponse(String status) {
        this.status = status;
    }
}
