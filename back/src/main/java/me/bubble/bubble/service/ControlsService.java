package me.bubble.bubble.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Controls;
import me.bubble.bubble.domain.Curve;
import me.bubble.bubble.repository.ControlsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ControlsService {
    private final ControlsRepository controlsRepository;

    public List<Controls> findByCurveId(Long curveId) {
        return controlsRepository.findByCurveId(curveId);
    }

    @Transactional
    public void deleteControlsByCurveId (Long curveId) {
        controlsRepository.deleteByCurveId(curveId);
    }

    public Controls createAndSaveControls(int x, int y, boolean visible, Curve curve) {
        Controls controls = Controls.builder()
                .x(x)
                .y(y)
                .visible(visible)
                .curve(curve)
                .build();
        return controlsRepository.save(controls);
    }
}
