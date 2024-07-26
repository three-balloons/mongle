package me.bubble.bubble.repository;

import me.bubble.bubble.domain.Bubble;
import me.bubble.bubble.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BubbleRepository extends JpaRepository<Bubble, Long> {
    Optional<Bubble> findByPathAndWorkspaceId(String path, Long workspaceId);
    List<Bubble> findByPathDepthAndPathStartingWithAndWorkspaceId(int pathDepth, String path, Long workspaceId);
    void deleteByPathStartingWithAndWorkspaceId(String path, Long workspaceId);
    Bubble findTopByWorkspaceIdOrderByPathDepthDesc(Long workspaceId);
    List<Bubble> findByPathDepthAndWorkspaceId(int pathDepth, Long workspaceId);
}
