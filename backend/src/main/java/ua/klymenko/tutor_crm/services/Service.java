package ua.klymenko.tutor_crm.services;

import java.util.List;
import java.util.Optional;

public interface Service<T> {
    T save(T t);
    void delete(long id);
    Optional<T> getById(long id);
    List<T> getAll();
    T update(T t);
}
