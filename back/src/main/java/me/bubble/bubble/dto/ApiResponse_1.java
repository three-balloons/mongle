package me.bubble.bubble.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ApiResponse_1<T> { // 데이터 객체 배열 넘겨주는 ApiResponse
    private final String code;
    private final String message;
    private final List<T> data;

    @Builder
    public ApiResponse_1(String message, String code, List<T> data) {
        this.code = code;
        this.message = message;
        this.data = data != null ? data : new ArrayList<>();
    }
}
