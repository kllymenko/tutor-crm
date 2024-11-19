package ua.klymenko.tutor_crm.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicUpdate;
import ua.klymenko.tutor_crm.entities.enums.LessonStatus;

import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Table(name = "lesson", schema = "tutor_crm")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @NotNull
    @ManyToMany(mappedBy = "lessons")
    private Set<Student> students;

    @NotNull
    @Column(name = "time_end", nullable = false)
    private Instant timeEnd;

    @NotNull
    @Column(name = "time_start", nullable = false)
    private Instant timeStart;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LessonStatus status;

    @Lob
    @Column(name = "summary")
    private String summary;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

}