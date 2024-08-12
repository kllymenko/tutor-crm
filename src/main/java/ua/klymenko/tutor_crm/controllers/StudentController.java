package ua.klymenko.tutor_crm.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.dto.StudentDto;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.interfaces.StudentService;
import ua.klymenko.tutor_crm.services.interfaces.UserService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Autowired
    public StudentController(StudentService studentService, UserService userService, ModelMapper modelMapper) {
        this.studentService = studentService;
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAll();
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable("id") Long studentId) {
        return studentService.getById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public Student createStudent(@RequestBody StudentDto studentDto) {
        User existingUser = userService.getById(studentDto.getTutor_id()).orElseThrow(()
                -> new EntityNotFoundException("User not found with id: " + studentDto.getTutor_id()));
        Student student = modelMapper.map(studentDto, Student.class);
        student.setTutor(existingUser);
        return studentService.save(student);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable("id") Long studentId, @RequestBody StudentDto studentDto) {
        if (!studentId.equals(studentDto.getId())) {
            throw new IllegalArgumentException("User ID in path must match the ID in the request body");
        }
        return studentService.save(modelMapper.map(studentDto, Student.class));
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable("id") Long studentId) {
        studentService.delete(studentId);
    }
}
