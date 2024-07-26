package me.bubble.bubble.service;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Workspace;
import me.bubble.bubble.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;

    public Workspace findByName(String name) {
        return workspaceRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Not Found " + name));
    }

}
