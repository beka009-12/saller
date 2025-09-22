"use client";
import { type FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignUp, useSignIn } from "@/api/user";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import scss from "./Register.module.scss";

const Register: FC = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode === "login");

  const { mutateAsync: signUpMutate } = useSignUp();
  const { mutateAsync: signInMutate } = useSignIn();
  const router = useRouter();

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUp,
  } = useForm<AUTH.SignUpReq>();

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    reset: resetSignIn,
  } = useForm<AUTH.SignInReq>();

  const onRegister: SubmitHandler<AUTH.SignUpReq> = async (formData) => {
    try {
      const response = await signUpMutate(formData);
      resetSignUp();
      toast.success("Регистрация успешна!");
      localStorage.setItem("token", response.token);
      router.push("/saller-page");
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);
      toast.error("Не удалось зарегистрироваться. Попробуйте снова.");
    }
  };

  const onLogin: SubmitHandler<AUTH.SignInReq> = async (formData) => {
    try {
      const response = await signInMutate(formData);
      resetSignIn();
      toast.success("Вход выполнен!");
      localStorage.setItem("token", response.token);
      router.push("/saller-page");
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
            <>
              <h1>С возвращением!</h1>
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
                <input
                  className={scss.inputs}
                  {...registerSignIn("password")}
                  type="password"
                  placeholder="Password"
                />
                <button type="submit">Login</button>
              </form>
              <button onClick={() => setIsLogin(false)}>Go to Register</button>
            </>
          ) : (
            <>
              <h1>Регистрация</h1>
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
                  type="password"
                  placeholder="Password"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("name")}
                  type="text"
                  placeholder="Name"
                />
                <button type="submit">Register</button>
              </form>
              <button onClick={() => setIsLogin(true)}>Go to Login</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Register;
