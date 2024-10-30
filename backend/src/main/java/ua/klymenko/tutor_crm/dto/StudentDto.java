package ua.klymenko.tutor_crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto implements Serializable {
    private Integer id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("user_id")
    private Long userId;
    @NotNull
    @Size(max = 64)
    private String name;
    @Size(max = 64)
    private  String surname;
    @NotNull
    @Size(max = 20)
    private  String phone;
    @NotNull
    @JsonProperty("price_per_lesson")
    private BigDecimal pricePerLesson;
}