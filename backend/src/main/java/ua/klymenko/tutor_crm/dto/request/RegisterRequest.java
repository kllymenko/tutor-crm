package ua.klymenko.tutor_crm.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Email адреса не може бути порожньою")
    @Email(message = "Email адреса повинна бути дійсною")
    @Size(max = 255, message = "Довжина email адреси повинна бути не більше 255 символів")
    private String email;

    @NotBlank(message = "Ім'я не може бути порожнім")
    @Size(max = 30, message = "Довжина імені повинна бути не більше 30 символів")
    private String name;

    @NotBlank(message = "Прізвище не може бути порожнім")
    @Size(max = 30, message = "Довжина прізвища повинна бути не більше 30 символів")
    private String surname;

    @NotBlank(message = "Номер телефону не може бути порожнім")
    @Size(max = 30, message = "Довжина номеру телефону повинна бути не більше 30 символів")
    private String phone;

    @NotBlank(message = "Пароль не може бути порожнім")
    @Size(max = 30, message = "Довжина пароля повинна бути не більше 30 символів")
    private String password;
}
