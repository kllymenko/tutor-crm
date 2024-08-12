package ua.klymenko.tutor_crm.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;

    @Column(name = "name", nullable = false, length = 64)
    private String name;

    @Column(name = "surname", length = 64)
    private String surname;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "price_per_lesson", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerLesson;

}