package ua.klymenko.tutor_crm.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import ua.klymenko.tutor_crm.entities.enums.LessonStatus;

import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Table(name = "lesson")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "time_start", nullable = false)
    private Instant timeStart;

    @Column(name = "time_end", nullable = false)
    private Instant timeEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LessonStatus status;

    @Lob
    @Column(name = "summary")
    private String summary;

    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid = false;

}