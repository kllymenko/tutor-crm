package ua.klymenko.tutor_crm.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.repositories.SubjectRepository;
import ua.klymenko.tutor_crm.services.interfaces.SubjectService;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;

    @Autowired
    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public Subject save(Subject subject) {
        Subject existing = subjectRepository.findByName(subject.getName());
        if (existing != null) {
            return existing;
        }
        return subjectRepository.save(subject);
    }

    @Override
    public void delete(long id) {
        subjectRepository.deleteById(id);
    }

    @Override
    public Optional<Subject> getById(long id) {
        return subjectRepository.findById(id);
    }

    @Override
    public List<Subject> getAll() {
        return subjectRepository.findAll();
    }

    @Override
    public Subject update(Subject subject) {
        return subjectRepository.save(subject);
    }
}
