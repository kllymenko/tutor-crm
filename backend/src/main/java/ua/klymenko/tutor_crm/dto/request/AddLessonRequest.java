package ua.klymenko.tutor_crm.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddLessonRequest {
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

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String summary;
}
