package ua.klymenko.tutor_crm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.klymenko.tutor_crm.entities.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
