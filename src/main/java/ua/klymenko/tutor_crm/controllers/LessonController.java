package ua.klymenko.tutor_crm.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.entities.Lesson;
import ua.klymenko.tutor_crm.entities.Payment;
import ua.klymenko.tutor_crm.services.interfaces.LessonService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    private final LessonService lessonService;

    @Autowired
    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
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
    public Lesson createLesson(@RequestBody Lesson lesson) {
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
