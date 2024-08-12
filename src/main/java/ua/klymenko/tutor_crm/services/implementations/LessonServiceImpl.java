package ua.klymenko.tutor_crm.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.klymenko.tutor_crm.entities.Lesson;
import ua.klymenko.tutor_crm.repositories.LessonRepository;
import ua.klymenko.tutor_crm.services.interfaces.LessonService;

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
