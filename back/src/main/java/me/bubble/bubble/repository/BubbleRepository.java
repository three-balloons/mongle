package me.bubble.bubble.repository;

import me.bubble.bubble.domain.Bubble;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BubbleRepository extends JpaRepository<Bubble, Long> {
    Optional<Bubble> findByPath(String path);
    List<Bubble> findByPathDepthAndPathStartingWith(int pathDepth, String path);
    void deleteByPathStartingWith(String path);
}
