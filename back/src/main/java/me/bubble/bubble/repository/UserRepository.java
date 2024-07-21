package me.bubble.bubble.repository;

import me.bubble.bubble.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
