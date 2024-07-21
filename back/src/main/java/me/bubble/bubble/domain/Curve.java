package me.bubble.bubble.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Curve {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "red")
    private int red;

    @Column(name = "green")
    private int green;

    @Column(name = "blue")
    private int blue;

    @Column(name = "alpha")
    private int alpha;

    @Column(name = "b_width")
    private int b_width;

    @Column(name = "b_height")
    private int b_height;

    @Column(name = "b_top")
    private int b_top;

    @Column(name = "b_left")
    private int b_left;

    @Column(name = "path")
    private String path;

    @Column(name = "thickness")
    private int thickness;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bubble_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Bubble bubble;

    @Builder
    public Curve(int red, int green, int blue, int alpha, int b_width, int b_height, int b_top, int b_left,
                 String path, int thickness, Bubble bubble) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.b_width = b_width;
        this.b_height = b_height;
        this.b_top = b_top;
        this.b_left = b_left;
        this.path = path;
        this.thickness = thickness;
        this.bubble = bubble;
    }

}
