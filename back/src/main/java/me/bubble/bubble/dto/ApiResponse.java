package me.bubble.bubble.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class ApiResponse<T> {
    private final String code;
    private final String message;
    private final List<T> data;

    @Builder
    public ApiResponse(String message, String code, List<T> data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
