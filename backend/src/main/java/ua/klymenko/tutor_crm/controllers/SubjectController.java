package ua.klymenko.tutor_crm.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.dto.SubjectDTO;
import ua.klymenko.tutor_crm.entities.Subject;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.interfaces.SubjectService;

import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<SubjectDTO>> getAllSubjects() {
        List<SubjectDTO> subjectDTOS = subjectService.getAll().stream()
                .map(subject -> new SubjectDTO(subject.getId(), subject.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(subjectDTOS);
    }


    @PostMapping
    public ResponseEntity<SubjectDTO> createSubject(@AuthenticationPrincipal User user, @RequestBody SubjectDTO subjectDto) {
        Subject subject = modelMapper.map(subjectDto, Subject.class);
        subject = subjectService.save(subject);
        return ResponseEntity.ok(modelMapper.map(subject, SubjectDTO.class));
    }
}
