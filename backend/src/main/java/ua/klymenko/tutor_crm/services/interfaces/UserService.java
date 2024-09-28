package ua.klymenko.tutor_crm.services.interfaces;

import org.springframework.security.core.userdetails.UserDetailsService;
import ua.klymenko.tutor_crm.entities.User;
import ua.klymenko.tutor_crm.services.Service;

public interface UserService extends Service<User> {
    UserDetailsService userDetailsService();
    User getByEmail(String email);
}
