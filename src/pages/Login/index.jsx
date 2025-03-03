import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { fetchUserData, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import { isValidInputTimeValue } from "@testing-library/user-event/dist/utils";
import { colors } from "@mui/material";
import { red } from "@mui/material/colors";

export const Login = () => {
    const isAuth = useSelector(selectIsAuth);
    const [loginError, setLoginError] = useState("");
    const {error} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchUserData(values));

        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        }

    };

    useEffect(() => {
        setLoginError("")
        if (error) {
            if (Array.isArray(error)) {
                // Обработка ошибок валидации формы
                error.forEach((err) => {
                    if (err.path && err.msg) {
                        setError(err.path, {
                            type: "manual",
                            message: err.msg,
                        });
                    }
                });
            } else if (error.message) {
                // Обработка ошибки неверного логина или пароля
                setLoginError(error.message);
            }
        }
    }, [error]);

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register("email", { required: "Укажите почту" })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    {...register("password", { required: "Укажите пароль" })}
                    helperText={errors.password?.message}
                    error={Boolean(errors.password?.message)}
                    fullWidth
                />
                {loginError && (
                    <Typography className={styles.errorText} variant="body2">
                        {loginError}
                    </Typography>
                )}

                <Button
                    disabled={!isValid}
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                >
                    Войти
                </Button>
            </form>
        </Paper>
    );
};
