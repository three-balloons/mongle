package me.bubble.bubble.dto;

import lombok.Getter;
import lombok.Setter;
import me.bubble.bubble.domain.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class PostUserResponse {
    private final String email;
    private final String name;
    private final LocalDateTime deletedAt;
    private final String accessToken;

    public PostUserResponse (User user, String accessToken) {
        this.email = user.getEmail();
        this.name = user.getName();
        this.deletedAt = user.getDeletedAt();
        this.accessToken = accessToken;
    }
}
