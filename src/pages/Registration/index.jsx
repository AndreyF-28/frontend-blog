import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchRegister,
    fetchUserData,
    selectIsAuth,
} from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth);
    const { error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values));

        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        }

    };

    useEffect(() => {
        if (error) {
            error.forEach((err) => {
                if (err.path && err.msg) {
                    setError(err.path, {
                        type: "manual",
                        message: err.msg,
                    });
                }
            });
        }
    }, [error]);

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    {...register("fullName", {
                        required: "Укажите полное имя",
                    })}
                    label="Полное имя"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register("email", { required: "Укажите почту" })}
                    label="E-Mail"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register("password", { required: "Укажите пароль" })}
                    label="Пароль"
                    fullWidth
                />
                <Button
                    disabled={!isValid}
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                >
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
