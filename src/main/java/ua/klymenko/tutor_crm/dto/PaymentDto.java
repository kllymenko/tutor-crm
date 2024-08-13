package ua.klymenko.tutor_crm.dto;

import lombok.Value;
import ua.klymenko.tutor_crm.entities.enums.PaymentMethod;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Payment}
 */
@Value
public class PaymentDto implements Serializable {
    Long id;
    Long tutor_id;
    Long student_id;
    BigDecimal amount;
    PaymentMethod method;
}