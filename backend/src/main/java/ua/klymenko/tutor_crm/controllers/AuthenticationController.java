package ua.klymenko.tutor_crm.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.dto.request.LoginRequest;
import ua.klymenko.tutor_crm.dto.request.RegisterRequest;
import ua.klymenko.tutor_crm.dto.response.LoginResponse;
import ua.klymenko.tutor_crm.dto.response.MessageResponse;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.exception.EmailAlreadyExistsException;
import ua.klymenko.tutor_crm.services.AuthenticationService;

@CrossOrigin
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<LoginResponse> loginUser(@ModelAttribute LoginRequest loginRequest) {
        LoginResponse response = authenticationService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<MessageResponse> registerUser(@ModelAttribute RegisterRequest registerDTO) {
        User registered = authenticationService.register(registerDTO);
        return new ResponseEntity<>(new MessageResponse("User registered"), HttpStatus.CREATED);
    }

    @PostMapping(value = "/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestHeader(value = "Authorization") String authorizationHeader) {
        String refreshToken = getToken(authorizationHeader);
        LoginResponse response = authenticationService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    private static String getToken(String authorizationHeader) {
        return authorizationHeader.substring("Bearer ".length());
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<MessageResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        return new ResponseEntity<>(new MessageResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
