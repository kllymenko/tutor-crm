package ua.klymenko.tutor_crm.dto;

import lombok.Value;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.entities.enums.LessonStatus;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.Lesson}
 */
@Value
public class LessonDto implements Serializable {
    Long id;
    Long tutor_id;
    Long student_id;
    String subject;
    Instant timeStart;
    Instant timeEnd;
    String status;
    String summary;
}