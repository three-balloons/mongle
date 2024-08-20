package me.bubble.bubble.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.bubble.bubble.domain.User;
import me.bubble.bubble.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public User createUser(String oauthId, String provider, String email, String name, LocalDateTime deletedAt, String refreshToken) {
        User user = User.builder()
                .oauthId(oauthId)
                .provider(provider)
                .email(email)
                .name(name)
                .deletedAt(deletedAt)
                .refreshToken(refreshToken)
                .build();

        return userRepository.save(user);  // DB에 저장 후 저장된 객체 반환
    }

    public Optional<User> findUserByOauthIdAndProvider(String oauthId, String provider) {
        return userRepository.findByOauthIdAndProvider(oauthId, provider);
    }
}
