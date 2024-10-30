package ua.klymenko.tutor_crm.services.interfaces;

import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.Service;

import java.util.List;

public interface StudentService extends Service<Student> {
    List<Student> getAllByUser(User user);
}
