package me.bubble.bubble.dto;

import lombok.Getter;

@Getter
public class Config {
    private final String color;
    private final int thickness;

    public Config(String color, int thickness) {
        this.color = color;
        this.thickness = thickness;
    }
}