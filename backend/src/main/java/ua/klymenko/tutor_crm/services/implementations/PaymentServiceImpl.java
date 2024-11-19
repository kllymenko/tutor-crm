package ua.klymenko.tutor_crm.services.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.klymenko.tutor_crm.entities.Payment;
import ua.klymenko.tutor_crm.entities.Student;
import ua.klymenko.tutor_crm.repositories.PaymentRepository;
import ua.klymenko.tutor_crm.repositories.StudentRepository;
import ua.klymenko.tutor_crm.services.interfaces.PaymentService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, StudentRepository studentRepository) {
        this.paymentRepository = paymentRepository;
        this.studentRepository = studentRepository;
    }


    @Override
    public Payment save(Payment payment) {
        Student student = payment.getStudent();
        student.setBalance(student.getBalance().add(payment.getAmount()));
        studentRepository.save(student);

        payment.setCreatedAt(Instant.now());
        payment.setUpdatedAt(Instant.now());

        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> getById(long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }


    @Override
    public void delete(long id) {
        paymentRepository.deleteById(id);
    }

}
