package me.bubble.bubble.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
@Getter
public class ApiResponse_2<T> { // 데이터 객체 하나 넘겨주는 ApiResponse
    private final String code;
    private final String message;
    private final T data;

    @Builder
    public ApiResponse_2(String message, String code, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
