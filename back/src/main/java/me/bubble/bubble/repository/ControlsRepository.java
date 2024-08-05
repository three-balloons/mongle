package me.bubble.bubble.repository;

import me.bubble.bubble.domain.Controls;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ControlsRepository extends JpaRepository<Controls, Long> {
    List<Controls> findByCurveId(Long curveId);
    void deleteByCurveId(Long curveId);
}
