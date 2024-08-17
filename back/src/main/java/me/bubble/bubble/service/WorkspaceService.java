package me.bubble.bubble.service;

import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.Workspace;
import me.bubble.bubble.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;


    public Workspace findWorkspaceById(UUID id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Not Found " + id));
    }

}
