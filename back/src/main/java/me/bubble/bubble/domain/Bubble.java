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

//Entity는 기본 생성자가 있어야 한다!
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bubble {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "top")
    private int top;

    @Column(name = "leftmost")
    private int leftmost;

    @Column(name = "width")
    private int width;

    @Column(name = "height")
    private int height;

    @Column(name = "path")
    private String path;

    @Column(name = "path_depth")
    private int pathDepth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Workspace workspace;

    @Builder
    public Bubble(int top, int leftmost, int width, int height, String path, int pathDepth, Workspace workspace) {
        this.top = top;
        this.leftmost = leftmost;
        this.width = width;
        this.height = height;
        this.path = path;
        this.pathDepth = pathDepth;
        this.workspace = workspace;
    }
}
