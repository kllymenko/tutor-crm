package ua.klymenko.tutor_crm.services.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.klymenko.tutor_crm.entities.Payment;
import ua.klymenko.tutor_crm.repositories.PaymentRepository;
import ua.klymenko.tutor_crm.services.interfaces.PaymentService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }


    @Override
    public Payment save(Payment payment) {
        payment.setTime(Instant.now());
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
