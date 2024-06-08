import React, { useContext } from "react";
import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButton";
import { Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { StoreContext } from "./StoreProvider";
import { useNavigate } from "react-router-dom";

const schema = yup
    .object({
        f_name: yup
            .string()
            .matches(/^[A-Za-z]+$/, "First Name should only contain letters")
            .required("First Name is required"),
        l_name: yup
            .string()
            .matches(/^[A-Za-z]+$/, "Last Name should only contain letters")
            .required("Last Name is required"),
        email: yup
            .string()
            .email("Enter valid email")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be atleast 8 characters")
            .required("Password is required"),
        c_password: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    })
    .required();

const Login = () => {
    const {updateState} = useContext(StoreContext);
    const navigate = useNavigate();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data) =>{
        const {f_name, l_name, email} = data;
        updateState({f_name, l_name, email});
        navigate('/profile');
    };
    return (
        <div>
            <div className="flex p-8 h-screen">
                <div className="basis-1/2">
                {/* Photo by <a href="https://unsplash.com/@ollipexxer?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Oliver Pecker</a> on <a href="https://unsplash.com/photos/jet-black-iphone-7-beside-analog-watch-HONJP8DyiSM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a> */}
                    <img className="bg-black h-full w-full rounded-3xl object-cover" src="/assets/banner.jpg" alt="bg" />
                </div>
                <div className="relative basis-1/2 p-24 flex flex-col justify-center">
                    <div className="absolute top-0">Techie</div>
                    <Typography className="text-center" variant="h4">
                        Create an account
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex my-6 gap-4">
                            <div className="basis-1/2">
                                <Controller
                                    name="f_name"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="First Name"
                                            error={errors.f_name}
                                            helperText={
                                                errors.f_name?.message ||
                                                undefined
                                            }
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <div className="basis-1/2">
                                <Controller
                                    name="l_name"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Last Name"
                                            error={errors.l_name}
                                            helperText={
                                                errors.l_name?.message ||
                                                undefined
                                            }
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="my-6">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        label="Email"
                                        error={errors.email}
                                        helperText={
                                            errors.email?.message || undefined
                                        }
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="my-6">
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        label="Password"
                                        type="password"
                                        error={errors.password}
                                        helperText={
                                            errors.password?.message ||
                                            undefined
                                        }
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="my-6">
                            <Controller
                                name="c_password"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        label="Confirm Password"
                                        type="password"
                                        error={errors.c_password}
                                        helperText={
                                            errors.c_password?.message ||
                                            undefined
                                        }
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="my-6">
                            <CustomButton
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                            >
                                Sign Up
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
