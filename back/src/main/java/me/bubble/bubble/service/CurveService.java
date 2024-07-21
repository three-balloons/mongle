package me.bubble.bubble.service;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Bubble;
import me.bubble.bubble.domain.Curve;
import me.bubble.bubble.repository.CurveRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CurveService {
    private final CurveRepository curveRepository;

    public List<Curve> findCurvesByBubble(Bubble bubble) {
        return curveRepository.findByBubbleId(bubble.getId());
    }
}
