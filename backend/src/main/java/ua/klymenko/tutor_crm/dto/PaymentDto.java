package ua.klymenko.tutor_crm.dto;

import lombok.*;
import ua.klymenko.tutor_crm.entities.enums.PaymentMethod;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto implements Serializable {
    Long id;
    Long tutor_id;
    Long student_id;
    BigDecimal amount;
    String method;
}