package ua.klymenko.tutor_crm.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ua.klymenko.tutor_crm.entities.Payment;
import ua.klymenko.tutor_crm.services.interfaces.PaymentService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
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
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.save(payment);
    }

    @PutMapping("/{id}")
    public Payment updatePayment(@PathVariable("id") Long paymentId, @RequestBody Payment payment) {
        if (!paymentId.equals(payment.getId())) {
            throw new IllegalArgumentException("User ID in path must match the ID in the request body");
        }
        return paymentService.save(payment);
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable("id") Long paymentId) {
        paymentService.delete(paymentId);
    }
}
