package ua.klymenko.tutor_crm.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.klymenko.tutor_crm.entities.Lesson;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.repositories.LessonRepository;
import ua.klymenko.tutor_crm.services.interfaces.LessonService;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public Lesson save(Lesson lesson) {
        Student student = lesson.getStudent();

        long lessonDurationMinutes = lesson.getTimeStart().until(lesson.getTimeEnd(), ChronoUnit.MINUTES);

        BigDecimal lessonPrice = student.getPricePerLesson()
                .multiply(BigDecimal.valueOf(lessonDurationMinutes))
                .divide(BigDecimal.valueOf(60));

        if(student.getBalance().compareTo(lessonPrice) >= 0){
            student.setBalance(student.getBalance().subtract(lessonPrice));
            lesson.setIsPaid(true);
        }
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
}
