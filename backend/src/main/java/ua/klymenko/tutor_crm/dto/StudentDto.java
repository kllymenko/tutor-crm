package ua.klymenko.tutor_crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Student}
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto implements Serializable {
    private Long id;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String surname;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal balance;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("price_per_lesson")
    private BigDecimal pricePerLesson;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("user_id")
    private Long userId;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("subject_ids")
    private Set<Long> subjectIds;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("lesson_ids")
    private Set<Long> lessonIds;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("updated_at")
    private Instant updatedAt;
}