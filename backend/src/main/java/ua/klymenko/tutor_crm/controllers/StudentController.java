package ua.klymenko.tutor_crm.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ua.klymenko.tutor_crm.dto.StudentDto;
import ua.klymenko.tutor_crm.dto.request.AddStudentRequest;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.interfaces.StudentService;
import ua.klymenko.tutor_crm.services.interfaces.SubjectService;
import ua.klymenko.tutor_crm.services.interfaces.UserService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;
    private final SubjectService subjectService;
    private final ModelMapper modelMapper;

    @Autowired
    public StudentController(StudentService studentService, SubjectService subjectService, ModelMapper modelMapper) {
        this.studentService = studentService;
        this.subjectService = subjectService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/my")
    public ResponseEntity<List<StudentDto>> getAllMyStudents(@AuthenticationPrincipal User user) {
        List<Student> students = studentService.getAllByUser(user);
        List<StudentDto> studentDTOs = students.stream()
                .map(student -> modelMapper.map(student, StudentDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(studentDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable("id") Long studentId) {
        Student student = studentService.getById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));
        return ResponseEntity.ok(modelMapper.map(student, StudentDto.class));
    }

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@AuthenticationPrincipal User user, @RequestBody AddStudentRequest addStudentRequest) {
        if (addStudentRequest.getSubjectIds() == null || addStudentRequest.getSubjectIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject IDs must be provided");
        }

        Set<Subject> subjects = addStudentRequest.getSubjectIds().stream()
                .map(id -> subjectService.getById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Subject not found with ID: " + id)))
                .collect(Collectors.toSet());

        Student student = modelMapper.map(addStudentRequest, Student.class);
        student.setUser(user);
        student.setSubjects(subjects);
        student = studentService.save(student);
        return ResponseEntity.ok(modelMapper.map(student, StudentDto.class));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@AuthenticationPrincipal User user, @PathVariable("id") Long studentId, @RequestBody StudentDto studentDto) {
        if (!studentId.equals(studentDto.getId())) {
            throw new IllegalArgumentException("Student ID in path must match the ID in the request body");
        }
        Student student = studentService.save(modelMapper.map(studentDto, Student.class));
        return ResponseEntity.ok(modelMapper.map(student, StudentDto.class));
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable("id") Long studentId) {
        studentService.delete(studentId);
    }

}
