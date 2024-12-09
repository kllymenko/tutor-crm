package ua.klymenko.tutor_crm.services.implementations;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.klymenko.tutor_crm.entities.Lesson;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.entities.enums.LessonStatus;
import ua.klymenko.tutor_crm.repositories.LessonRepository;
import ua.klymenko.tutor_crm.repositories.StudentRepository;
import ua.klymenko.tutor_crm.services.interfaces.LessonService;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository, StudentRepository studentRepository) {
        this.lessonRepository = lessonRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional
    public Lesson save(Lesson lesson) {
        long lessonDurationMinutes = lesson.getTimeStart().until(lesson.getTimeEnd(), ChronoUnit.MINUTES);

        for (Student student : lesson.getStudents()) {
            BigDecimal lessonPrice = student.getPricePerLesson()
                    .multiply(BigDecimal.valueOf(lessonDurationMinutes))
                    .divide(BigDecimal.valueOf(60), BigDecimal.ROUND_HALF_UP);
            student.setBalance(student.getBalance().subtract(lessonPrice));
        }

        lesson.setStatus(LessonStatus.PLANNED);
        lesson.setCreatedAt(Instant.now());
        lesson.setUpdatedAt(Instant.now());
        return lessonRepository.save(lesson);
    }

    @Override
    public Optional<Lesson> getById(long id) {
        return lessonRepository.findById(id);
    }


    @Override
    public void delete(long id) {
        lessonRepository.deleteById(id);
    }

    @Override
    public List<Lesson> getAll() {
        return lessonRepository.findAll();
    }

    @Override
    public Lesson update(Lesson lesson) {
        lesson.setUpdatedAt(Instant.now());
        return lessonRepository.save(lesson);
    }

    @Override
    public List<Lesson> getAllByUser(User user) {
        return lessonRepository.findByUserId(user.getId());
    }
}
