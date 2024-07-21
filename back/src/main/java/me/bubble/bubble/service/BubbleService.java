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


    public Bubble findByPath(String workspace){
        return bubbleRepository.findByPath(workspace)
                .orElseThrow(() -> new IllegalArgumentException("Not Found " + workspace));
    }

    public List<Bubble> findChildrenByBubble (Bubble bubble) {
        return bubbleRepository.findByPathDepthAndPathStartingWith(bubble.getPathDepth()+1, bubble.getPath());
    }

    @Transactional
    public void deleteByPath(String workspace) {
        bubbleRepository.deleteByPathStartingWith(workspace);
        return;
    }
}
