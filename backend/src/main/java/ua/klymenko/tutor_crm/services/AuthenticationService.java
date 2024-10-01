package ua.klymenko.tutor_crm.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.klymenko.tutor_crm.dto.response.LoginResponse;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.exception.JwtTokenException;
import ua.klymenko.tutor_crm.security.JwtService;
import ua.klymenko.tutor_crm.services.interfaces.UserService;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;


    public LoginResponse login(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                email,
                password
        ));

        User user = (User) userService.userDetailsService().loadUserByUsername(email);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new LoginResponse(accessToken, refreshToken);
    }

//    public User register(RegisterRequest request) {
//        return userService.create(User.builder()
//                .login(request.getLogin())
//                .email(request.getEmail())
//                .passwordHash(passwordEncoder.encode(request.getPassword()))
//                .role(String.valueOf(UserRole.PLAYER))
//                .isBanned(false)
//                .isEnabled(false)
//                .gameWinCount(0L)
//                .gameLoseCount(0L)
//                .gameCount(0L)
//                .coinsTotal(0L)
//                .build());
//    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtService.isRefreshToken(refreshToken))
            throw new JwtTokenException("Only refresh tokens are allowed");

        String email = jwtService.extractEmail(refreshToken);
        User user = (User) userService.userDetailsService().loadUserByUsername(email);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        return new LoginResponse(newAccessToken, newRefreshToken);
    }

//    public boolean confirmRegistration(String confirmationCode) {
//        User user = userService.getByConfirmationCode(confirmationCode);
//        if (user.isEnabled() || user.getConfirmationCode() == null) {
//            return false;
//        }
//        user.setConfirmationCode(null);
//        user.setIsEnabled(true);
//        userService.update(user.getId(), user);
//        return true;
//    }
}
