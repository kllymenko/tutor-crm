package ua.klymenko.tutor_crm.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ua.klymenko.tutor_crm.dto.LessonDTO;
import ua.klymenko.tutor_crm.dto.StudentDTO;
import ua.klymenko.tutor_crm.dto.request.AddLessonRequest;
import ua.klymenko.tutor_crm.entities.Lesson;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.interfaces.LessonService;
import ua.klymenko.tutor_crm.services.interfaces.StudentService;
import ua.klymenko.tutor_crm.services.interfaces.SubjectService;

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

    @GetMapping("/my")
    public ResponseEntity<List<LessonDTO>> getAllMyLessons(@AuthenticationPrincipal User user) {
        List<Lesson> lessons = lessonService.getAllByUser(user);
        List<LessonDTO> lessonDTOs = lessons.stream()
                .map(lesson -> modelMapper.map(lesson, LessonDTO.class))
                .toList();
        return ResponseEntity.ok(lessonDTOs);
    }

    @GetMapping("/{id}")
    public Lesson getLessonById(@PathVariable("id") Long lessonId) {
        return lessonService.getById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));
    }

    @PostMapping
    public ResponseEntity<LessonDTO> createLesson(@AuthenticationPrincipal User user, @RequestBody AddLessonRequest addLessonRequest) {
        if (addLessonRequest.getStudentIds() == null || addLessonRequest.getStudentIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Students IDs must be provided");
        }

        Set<Student> students = addLessonRequest.getStudentIds().stream()
                .map(id -> studentService.getById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Students not found with ID: " + id)))
                .collect(Collectors.toSet());

        Subject subject = subjectService.getById(addLessonRequest.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with ID: " + addLessonRequest.getSubjectId()));

        Lesson lesson = modelMapper.map(addLessonRequest, Lesson.class);
        lesson.setUser(user);
        lesson.setStudents(students);
        lesson.setSubject(subject);

        lesson = lessonService.save(lesson);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(lesson, LessonDTO.class));
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
