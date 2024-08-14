package ua.klymenko.tutor_crm.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.dto.LessonDto;
import ua.klymenko.tutor_crm.entities.Lesson;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.interfaces.LessonService;
import ua.klymenko.tutor_crm.services.interfaces.StudentService;
import ua.klymenko.tutor_crm.services.interfaces.SubjectService;
import ua.klymenko.tutor_crm.services.interfaces.UserService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    private final LessonService lessonService;
    private final UserService userService;
    private final StudentService studentService;
    private final SubjectService subjectService;
    private final ModelMapper modelMapper;

    @Autowired
    public LessonController(LessonService lessonService, UserService userService, StudentService studentService, SubjectService subjectService, ModelMapper modelMapper) {
        this.lessonService = lessonService;
        this.userService = userService;
        this.studentService = studentService;
        this.subjectService = subjectService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public List<Lesson> getAllLessons() {
        return lessonService.getAll();
    }

    @GetMapping("/{id}")
    public Lesson getLessonById(@PathVariable("id") Long lessonId) {
        return lessonService.getById(lessonId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public Lesson createLesson(@RequestBody LessonDto lessonDto) {
        User existingTutor = userService.getById(lessonDto.getTutor_id()).orElseThrow(()
                -> new EntityNotFoundException("Tutor not found with id: " + lessonDto.getTutor_id()));
        Student existingStudent = studentService.getById(lessonDto.getStudent_id()).orElseThrow(()
                -> new EntityNotFoundException("Student not found with id: " + lessonDto.getStudent_id()));
        Subject subject = subjectService.save(new Subject(null, lessonDto.getSubject()));
        Lesson lesson = convertToEntity(lessonDto, existingTutor, existingStudent, subject);
        return lessonService.save(lesson);
    }

    @PutMapping("/{id}")
    public Lesson updateLesson(@PathVariable("id") Long lessonId, @RequestBody Lesson lesson) {
        if (!lessonId.equals(lesson.getId())) {
            throw new IllegalArgumentException("User ID in path must match the ID in the request body");
        }
        return lessonService.save(lesson);
    }

    @DeleteMapping("/{id}")
    public void deleteLesson(@PathVariable("id") Long lessonId) {
        lessonService.delete(lessonId);
    }

    private Lesson convertToEntity(LessonDto lessonDto, User tutor, Student student, Subject subject) {
        Lesson lesson = modelMapper.map(lessonDto, Lesson.class);
        lesson.setTutor(tutor);
        lesson.setStudent(student);
        lesson.setSubject(subject);
        return lesson;
    }
}
