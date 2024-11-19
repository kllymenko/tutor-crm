package ua.klymenko.tutor_crm.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.dto.PaymentDto;
import ua.klymenko.tutor_crm.entities.Payment;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.interfaces.PaymentService;
import ua.klymenko.tutor_crm.services.interfaces.StudentService;
import ua.klymenko.tutor_crm.services.interfaces.UserService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;
    private final StudentService studentService;
    private final ModelMapper modelMapper;

    @Autowired
    public PaymentController(PaymentService paymentService, UserService userService, StudentService studentService, ModelMapper modelMapper) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.studentService = studentService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAll();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable("id") Long paymentId) {
        return paymentService.getById(paymentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public Payment createPayment(@AuthenticationPrincipal User user, @RequestBody PaymentDto paymentDto) {
        Payment payment = modelMapper.map(paymentDto, Payment.class);
//        Student existingStudent = studentService.getById(paymentDto.getStudentId()).orElseThrow(()
//                -> new EntityNotFoundException("Student not found with id: " + paymentDto.getStudentId()));
        return paymentService.save(payment);
    }

    @PutMapping("/{id}")
    public Payment updatePayment(@PathVariable("id") Long paymentId, @RequestBody PaymentDto paymentDto) {
        if (!paymentId.equals(paymentDto.getId())) {
            throw new IllegalArgumentException("User ID in path must match the ID in the request body");
        }
        return paymentService.save(modelMapper.map(paymentDto, Payment.class));
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable("id") Long paymentId) {
        paymentService.delete(paymentId);
    }
}
