package me.bubble.bubble.service;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Bubble;
import me.bubble.bubble.repository.BubbleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BubbleService {
    private final BubbleRepository bubbleRepository;


    public Bubble findByPathAndWorkspaceId(String path, Long workspaceId){
        return bubbleRepository.findByPathAndWorkspaceId(path, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Not Found at findByPathAndWorkspaceId"));
    }

    public List<Bubble> findChildrenByBubbleAndWorkspaceId (Bubble bubble, Long workspaceId) {
        return bubbleRepository.findByPathDepthAndPathStartingWithAndWorkspaceId(bubble.getPathDepth()+1,
                bubble.getPath(), workspaceId);
    }

    public Bubble getMaxPathDepth(Long workspaceId) {
        return bubbleRepository.findTopByWorkspaceIdOrderByPathDepthDesc(workspaceId);
    }

    public List<Bubble> findBubblesByPathDepthAndWorkspaceId (int pathDepth, Long workspaceId) {
        return bubbleRepository.findByPathDepthAndWorkspaceId(pathDepth, workspaceId);
    }
    @Transactional
    public void deleteByPathStartingWithAndWorkspaceId(String path, Long workspaceId) {
        bubbleRepository.deleteByPathStartingWithAndWorkspaceId(path, workspaceId);
    }


    public Bubble saveBubble(Bubble bubble) {
        return bubbleRepository.save(bubble);
    }
}
