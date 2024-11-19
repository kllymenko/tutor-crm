package ua.klymenko.tutor_crm.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    private final LessonService lessonService;
    private final StudentService studentService;
    private final SubjectService subjectService;
    private final ModelMapper modelMapper;

    @Autowired
    public LessonController(LessonService lessonService, StudentService studentService, SubjectService subjectService, ModelMapper modelMapper) {
        this.lessonService = lessonService;
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
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));
    }

    @PostMapping
    public Lesson createLesson(@AuthenticationPrincipal User user, @RequestBody LessonDto lessonDto) {
        Lesson lesson = modelMapper.map(lessonDto, Lesson.class);
//        Set<Student> students = lessonDto.getStudentIds().stream()
//                .map(studentId -> studentService.getById(studentId)
//                        .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId)))
//                .collect(Collectors.toSet());
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

}
