package ua.klymenko.tutor_crm.dto;

import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.User}
 */
@Value
public class UserDto implements Serializable {
    Long id;
    String name;
    String surname;
    String email;
    String passwordHash;
    String phone;
}