package ua.klymenko.tutor_crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import ua.klymenko.tutor_crm.entities.Student;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserDto implements Serializable {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String passwordHash;
    private String phone;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Set<Student> students = new LinkedHashSet<>();
}