package ua.klymenko.tutor_crm.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import ua.klymenko.tutor_crm.dto.SubjectDto;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddStudentRequest {
    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String surname;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("price_per_lesson")
    private BigDecimal pricePerLesson;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("subject_ids")
    private Set<Long> subjectIds;
}
