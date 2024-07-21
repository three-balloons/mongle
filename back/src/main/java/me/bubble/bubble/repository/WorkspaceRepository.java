package me.bubble.bubble.repository;

import me.bubble.bubble.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
}
