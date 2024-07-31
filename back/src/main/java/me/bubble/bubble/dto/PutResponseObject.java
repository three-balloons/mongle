package me.bubble.bubble.dto;

import lombok.Getter;

@Getter
public class PutResponseObject {
    private final Long id;
    private final boolean successYn;

    public PutResponseObject(Long id, boolean successYn) {
        this.id = id;
        this.successYn = successYn;
    }
}
