package me.bubble.bubble.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Controls;
import me.bubble.bubble.repository.ControlsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ControlsService {
    private final ControlsRepository controlsRepository;

    public List<Controls> findByCurveId(Long curveId) {
        return controlsRepository.findByCurveId(curveId);
    }
}
