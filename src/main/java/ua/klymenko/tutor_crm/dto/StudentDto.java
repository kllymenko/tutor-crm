package ua.klymenko.tutor_crm.dto;

import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Student}
 */
@Value
public class StudentDto implements Serializable {
    Long id;
    Long tutor_id;
    String name;
    String surname;
    String phone;
    BigDecimal pricePerLesson;
}