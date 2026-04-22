"use client";
import { useState, type FC } from "react";
import scss from "./Authentication.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  usePostSallerSignInSaller,
  usePostSallerSignUpSaller,
} from "@/src/api/generated/endpoints/saller/saller";
import { LoginInput, RegisterInput } from "@/src/api/generated/models";

const Authentication: FC = () => {
  const searchParams = useSearchParams();
  const mode = searchParams?.get("mode");
  const [isLogin, setIsLogin] = useState(mode === "login");

  const { mutateAsync: signUpMutate } = usePostSallerSignUpSaller();
  const { mutateAsync: signInMutate } = usePostSallerSignInSaller();
  const router = useRouter();

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUp,
  } = useForm<RegisterInput>();

  const { register: registerSignIn, handleSubmit: handleSubmitSignIn } =
    useForm<LoginInput>();

  const onRegister: SubmitHandler<RegisterInput> = async (formData) => {
    try {
      const response = await signUpMutate({ data: formData });

      const token = response?.token;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Регистрация успешна!");
        resetSignUp();
        router.push("/store");
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      toast.error("Не удалось зарегистрироваться. Проверьте данные.");
    }
  };

  const onLogin: SubmitHandler<LoginInput> = async (formData) => {
    try {
      const response = await signInMutate({ data: formData });

      // Проверяем наличие данных и токена
      const token = response?.token;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Вход выполнен!");
        router.push("/");
      } else {
        toast.error("Сервер не вернул токен доступа");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast.error("Неверный email или пароль.");
    }
  };

  return (
    <section className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          {isLogin ? (
            <div className={scss.loginBox}>
              <h1 className={scss.h1}>С возвращением!</h1>
              <p className={scss.subtitle}>Войдите в аккаунт продавца</p>

              <form
                className={scss.form}
                onSubmit={handleSubmitSignIn(onLogin)}
              >
                <input
                  className={scss.inputs}
                  {...registerSignIn("email", { required: true })}
                  type="email"
                  placeholder="Email"
                />
                <input
                  className={scss.inputs}
                  {...registerSignIn("password", { required: true })}
                  type="password"
                  placeholder="Пароль"
                />
                <button className={scss.button} type="submit">
                  Войти
                </button>
              </form>

              <p
                onClick={() => setIsLogin(false)}
                className={scss.registerLink}
              >
                Нет аккаунта? <span>Создать</span>
              </p>
            </div>
          ) : (
            <div className={scss.loginBox}>
              <h1 className={scss.h1}>Стать продавцом</h1>
              <p className={scss.subtitle}>
                Создайте аккаунт для вашего бизнеса
              </p>

              <form
                className={scss.form}
                onSubmit={handleSubmitSignUp(onRegister)}
              >
                <input
                  className={scss.inputs}
                  {...registerSignUp("email", { required: true })}
                  type="email"
                  placeholder="Email"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("password", {
                    required: true,
                    minLength: 6,
                  })}
                  type="password"
                  placeholder="Пароль"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("name", { required: true })}
                  type="text"
                  placeholder="Ваше имя"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("phone" as any)} // Исправлено: добавлено имя поля
                  type="tel"
                  placeholder="Телефон"
                />
                <button className={scss.button} type="submit">
                  Зарегистрироваться
                </button>
              </form>

              <p className={scss.registerLink} onClick={() => setIsLogin(true)}>
                Уже есть аккаунт? <span>Войти</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Authentication;
