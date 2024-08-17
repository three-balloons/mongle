package me.bubble.bubble.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name = "Users")
public class User implements UserDetails { //UserDetails를 상속받아 인증객체로 사용
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Builder
    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }

    // 로그인 구현

    @Override // 권한 반환
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("user"));
    }

    @Override // 사용자의 id(고유한 값) 반환
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 만료되었는지 확인하는 로직, true -> 만료되지 않았다.
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠금되었는지 확인하는 로직, true -> 잠금되지 않았다.
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 패스워드가 만료되었는지 확인하는 로직, true -> 만료되지 않았다.
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정이 사용가능한지 확인하는 로직, true -> 사용 가능하다.
    }
}
