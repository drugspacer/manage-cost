package xyz.jesusohmyjesus.managecost.controller.message;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SuccessMessage {
    REGISTERED_SUCCESSFULLY("Регистрация прошла успешно"),
    CREATED("Данные успешно сохранены"),
    UPDATED("Данные успешно обновлены"),
    DELETED("Данные успешно удалены"),
    TRIP_ARCHIVED("Поездка записана в архив"),
    USER_DELETED("Пользователь удалён"),
    PASSWORD_CHANGED("Пароль изменён");

    private final String label;
}
