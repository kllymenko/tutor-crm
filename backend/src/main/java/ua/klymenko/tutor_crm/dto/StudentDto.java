package ua.klymenko.tutor_crm.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Student}
 */
@Value
public class StudentDto implements Serializable {
    Integer id;
    @NotNull
    @Size(max = 64)
    String name;
    @Size(max = 64)
    String surname;
    @NotNull
    @Size(max = 20)
    String phone;
    @NotNull
    BigDecimal pricePerLesson;
}