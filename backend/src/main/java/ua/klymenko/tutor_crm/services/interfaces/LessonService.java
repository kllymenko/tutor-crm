package ua.klymenko.tutor_crm.services.interfaces;

import ua.klymenko.tutor_crm.entities.Lesson;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.Service;

import java.util.List;

public interface LessonService extends Service<Lesson> {
    List<Lesson> getAllByUser(User user);
}
