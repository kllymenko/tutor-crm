package ua.klymenko.tutor_crm.entities.enums;

import lombok.Getter;

@Getter
public enum PaymentMethod {
    CASH("CASH"),
    CARD("CARD");

    private final String name;

    PaymentMethod(String name) {this.name = name;}
}
