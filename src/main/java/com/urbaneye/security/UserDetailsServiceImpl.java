package com.urbaneye.security;

import com.urbaneye.entity.User;
import com.urbaneye.entity.enums.AccountStatus;
import com.urbaneye.entity.enums.Role;
import com.urbaneye.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() == Role.CITIZEN || user.getRole() == Role.USER) {
            authorities.add(new SimpleGrantedAuthority("ROLE_CITIZEN"));
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }

        boolean isDisabled = user.getStatus() == AccountStatus.DISABLED;
        boolean isLocked   = user.getStatus() == AccountStatus.LOCKED;

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .disabled(isDisabled)
                .accountLocked(isLocked)
                .authorities(authorities)
                .build();
    }
}
