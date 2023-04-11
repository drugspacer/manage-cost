type ErrorState<T> = {
  [K in keyof T]?: string | string[];
};

export enum ERRORS {
  REQUIRED = "Поле необходимо заполнить",
  REQUIRED_MANY = "Поля необходимо заполнить",
  MIN_LENGTH = "Минимальная длина",
  CONFIRM_PASSWORD = "Пароли не совпадают",
  IS_ACTIVE_REQUIRED = "Необходим хотя бы один участник",
  RECORD_LAND = "Итоговая сумма не совпадает в колонке Заплачено",
  RECORD_BORROW = "Итоговая сумма не совпадает в колонке Потрачено",
}

export default ErrorState;
