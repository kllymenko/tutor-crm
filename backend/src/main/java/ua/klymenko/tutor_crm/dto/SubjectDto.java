package ua.klymenko.tutor_crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Subject}
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDto implements Serializable {
    private Long id;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;
}