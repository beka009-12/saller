"use client";
import { useState, type FC } from "react";
import scss from "./Authentication.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useSignUp } from "@/src/api/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Authentication: FC = () => {
  const searchParams = useSearchParams();
  const mode = searchParams?.get("mode");
  const [isLogin, setIsLogin] = useState(mode === "login");

  const { mutateAsync: signUpMutate } = useSignUp();
  const { mutateAsync: signInMutate } = useSignIn();
  const router = useRouter();

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUp,
  } = useForm<AUTH.RegisterReq>();

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    reset: resetSignIn,
  } = useForm<AUTH.LoginReq>();

  const onRegister: SubmitHandler<AUTH.RegisterReq> = async (formData) => {
    try {
      const response = await signUpMutate(formData);

      resetSignUp();
      toast.success("Регистрация успешна!");
      localStorage.setItem("token", response.token);
      router.push("/store");
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);
      toast.error("Не удалось зарегистрироваться. Попробуйте снова.");
    }
  };

  const onLogin: SubmitHandler<AUTH.LoginReq> = async (formData) => {
    try {
      const response = await signInMutate(formData);

      if (response.user?.role.toLowerCase() !== "owner") {
        toast.error("Доступ только для владельцев магазинов.");
        return;
      } else {
        resetSignIn();
        toast.success("Вход выполнен!");
        localStorage.setItem("token", response.token);
        router.push("/");
      }
    } catch (error: any) {
      console.error("Ошибка входа:", error);
      toast.error("Не удалось войти. Проверьте email и пароль.");
    }
  };

  return (
    <section className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          {isLogin ? (
            <div className={scss.loginBox}>
              <h1 className={scss.h1}>С возвращением!</h1>
              <p className={scss.subtitle}>
                Войдите в аккаунт, чтобы продолжить работу
              </p>

              <form
                className={scss.form}
                onSubmit={handleSubmitSignIn(onLogin)}
              >
                <input
                  className={scss.inputs}
                  {...registerSignIn("email")}
                  type="email"
                  placeholder="Email"
                />
                {}
                <input
                  className={scss.inputs}
                  {...registerSignIn("password")}
                  type="password"
                  placeholder="Пароль"
                  minLength={6}
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
            <>
              <h1 className={scss.h1}>Добро пожаловать!</h1>
              <p className={scss.subtitle}>
                Создайте аккаунт, чтобы начать пользоваться сервисом
              </p>

              <form
                className={scss.form}
                onSubmit={handleSubmitSignUp(onRegister)}
              >
                <input
                  className={scss.inputs}
                  {...registerSignUp("email")}
                  type="email"
                  placeholder="Email"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("password")}
                  minLength={6}
                  type="password"
                  placeholder="Пароль"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("name")}
                  type="text"
                  placeholder="Ваше имя"
                />
                <button className={scss.button} type="submit">
                  Зарегистрироваться
                </button>
              </form>

              <p className={scss.registerLink} onClick={() => setIsLogin(true)}>
                Уже есть аккаунт? <span>Войти</span>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Authentication;
