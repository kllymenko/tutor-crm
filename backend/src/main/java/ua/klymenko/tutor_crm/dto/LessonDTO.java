package ua.klymenko.tutor_crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import ua.klymenko.tutor_crm.entities.enums.LessonStatus;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Lesson}
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO implements Serializable {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("subject_id")
    private Long subjectId;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("student_ids")
    private Set<Long> studentIds;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("time_end")
    private Instant timeEnd;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("time_start")
    private Instant timeStart;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LessonStatus status;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String summary;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("user_id")
    private Long userId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("updated_at")
    private Instant updatedAt;
}