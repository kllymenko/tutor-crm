package ua.klymenko.tutor_crm.dto;

import lombok.*;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.entities.enums.LessonStatus;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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