package me.bubble.bubble.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Controls {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "x")
    private int x;

    @Column(name = "y")
    private int y;

    @Column(name = "is_visible")
    private int is_visible;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curve_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Curve curve;

    @Builder
    public Controls(int x, int y, int is_visible, Curve curve) {
        this.x = x;
        this.y = y;
        this.is_visible = is_visible;
        this.curve = curve;
    }
}
