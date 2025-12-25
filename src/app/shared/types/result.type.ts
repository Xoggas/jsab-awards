// Успешный результат с данными типа T
export type Success<T> = {
  success: true;
  failure: false;
  data: T;
};

// Ошибка всегда как строка
export type Failure = {
  success: false;
  failure: true;
  error: string;
};

// Универсальный Result с фиксированной строковой ошибкой
export type Result<T> = Success<T> | Failure;

// Функции для создания результатов
export function success<T>(data: T): Success<T> {
  return {success: true, failure: false, data};
}

export function fail(error: string): Failure {
  return {success: false, failure: true, error};
}
