package ua.klymenko.tutor_crm.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.dto.SubjectDto;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.interfaces.SubjectService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectService subjectService;
    private final ModelMapper modelMapper;

    @Autowired
    public SubjectController(final SubjectService subjectService, ModelMapper modelMapper) {
        this.subjectService = subjectService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAll();
    }

    @PostMapping
    public ResponseEntity<SubjectDto> createSubject(@AuthenticationPrincipal User user, @RequestBody SubjectDto subjectDto) {
        Subject subject = modelMapper.map(subjectDto, Subject.class);
        Subject savedSubject = subjectService.save(subject);
        return ResponseEntity.ok(modelMapper.map(savedSubject, SubjectDto.class));
    }
}
