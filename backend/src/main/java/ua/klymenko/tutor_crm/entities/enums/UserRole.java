package ua.klymenko.tutor_crm.entities.enums;

public enum UserRole {
    ADMIN("ADMIN"),
    PLAYER("PLAYER");

    private final String name;

    UserRole(String name) {this.name = name;}
}
