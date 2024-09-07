package ua.klymenko.tutor_crm.entities.enums;

import lombok.Getter;

@Getter
public enum LessonStatus {
    COMPLETED("COMPLETED"),
    CANCELED("CANCELED"),
    PLANNED("PLANNED");

    private final String name;

    LessonStatus(String name) {this.name = name;}
}
