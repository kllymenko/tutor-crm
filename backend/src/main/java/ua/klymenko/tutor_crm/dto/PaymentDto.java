package ua.klymenko.tutor_crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import ua.klymenko.tutor_crm.entities.enums.PaymentMethod;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Payment}
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto implements Serializable {
    private Long id;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    BigDecimal amount;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("student_id")
    Long studentId;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    PaymentMethod method;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("updated_at")
    private Instant updatedAt;
}