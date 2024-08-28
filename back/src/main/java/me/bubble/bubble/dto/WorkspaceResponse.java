package me.bubble.bubble.dto;

import lombok.Getter;
import lombok.Setter;
import me.bubble.bubble.domain.Workspace;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class WorkspaceResponse {
    private final UUID id;
    private final String name;
    private final String theme;
    private final LocalDate create_date;
    private final LocalDate delete_date;

    public WorkspaceResponse(Workspace workspace) {
        this.id = workspace.getId();
        this.name = workspace.getName();
        this.theme = workspace.getTheme();
        this.create_date = workspace.getCreatedAt().toLocalDate(); // LocalDate로 변환
        this.delete_date = workspace.getDeletedAt() != null ? workspace.getDeletedAt().toLocalDate() : null; // LocalDate로 변환
    }
}
