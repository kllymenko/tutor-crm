package ua.klymenko.tutor_crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import ua.klymenko.tutor_crm.entities.enums.UserRole;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link ua.klymenko.tutor_crm.entities.User}
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto implements Serializable {
    private Long id;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String surname;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String email;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone;

    @NotNull
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Size(max = 45, message = "Password have to contain up to 45 symbols!")
    @JsonProperty("password_hash")
    private String passwordHash;

    private UserRole role;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("updated_at")
    private Instant updatedAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("is_approved")
    private Boolean isApproved;
}