import React from "react";
import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButton";
import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
    getUserPool,
} from "./CognitoHelper";
import useQuestionBank from "./hooks/useQuestionBank";
import { toast } from "react-toastify";
import axios from 'axios';
const schema = yup
    .object({
        username: yup.string().required("Username is required"),
        email: yup.string().email().required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be atleast 8 characters")
            .required("Password is required"),
        c_password: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
        security_question: yup
            .string()
            .required("Security Question is required"),
        security_answer: yup.string().required("Security Answer is required"),
        caesar_key: yup
            .number()
            .min(1, "Caesar key must be greater than 1")
            .max(25, "Caesar key must be less than 25")
            .required("Caesar Key is required"),
        role: yup.string().required("Role is required"),
    })
    .required();

const Register = () => {
    const navigate= useNavigate();
    const { questionBank, isLoading } = useQuestionBank();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data) => {
        const userpool = getUserPool();
        userpool.signUp(
            data.username,
            data.password,
            [
                {
                    Name: "email",
                    Value: data.email,
                },
                {
                    Name: "custom:role",
                    Value: data.role,
                },
            ],
            [
                {
                    Name: "caesar_key",
                    Value: data.caesar_key.toString(),
                },
                {
                    Name: "security_questions",
                    Value: JSON.stringify({
                        question: data.security_question,
                        answer: data.security_answer,
                    }),
                },
            ],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if(result){
                    console.log(result)
                    axios.post("https://y18o50edd8.execute-api.us-east-1.amazonaws.com/test/registration-notification",{
                        email: data.email,
                        userId:result.userSub
                    })
                }
                toast.success("User created successfully");
                // setTimeout(() => {
                //     window.location.href = "/login";
                // }, 1000);
            }
    )
    ;
    };
    if (isLoading) return <div className="h-screen flex justify-center items-center"><CircularProgress /></div>;
    return (
        <div>
            <div className="flex p-8 h-screen">
                <div className="basis-1/2">
                    {/* Photo by <a href="https://unsplash.com/@ollipexxer?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Oliver Pecker</a> on <a href="https://unsplash.com/photos/jet-black-iphone-7-beside-analog-watch-HONJP8DyiSM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a> */}
                    <img
                        className="bg-black h-full w-full rounded-3xl object-contain"
                        src="/assets/register_banner.png"
                        alt="bg"
                    />
                </div>
                <div className="relative basis-1/2 p-24 flex flex-col justify-center">
                    <div className="absolute top-0">DalVacationHome</div>
                    <Typography className="text-center" variant="h4">
                        Create an account
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="my-3">
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        label="Username"
                                        error={errors.username}
                                        helperText={
                                            errors.username?.message ||
                                            undefined
                                        }
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="my-3">
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
                        <div className="my-3">
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
                        <div className="my-3">
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
                        <div className="my-3">
                            <Controller
                                name="security_question"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Security Question
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Security Question"
                                            error={errors.security_question}
                                            {...field}
                                        >
                                            {questionBank.map((question) => (
                                                <MenuItem
                                                    key={question.q_id}
                                                    value={question.q_id}
                                                >
                                                    {question.q}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </div>
                        <div className="my-3">
                            <Controller
                                name="security_answer"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        label="Security Answer"
                                        error={errors.security_answer}
                                        helperText={
                                            errors.security_answer?.message ||
                                            undefined
                                        }
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="my-3">
                            <Controller
                                name="caesar_key"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        label="Caesar Key"
                                        error={errors.caesar_key}
                                        helperText={
                                            errors.caesar_key?.message ||
                                            undefined
                                        }
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="my-3">
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="role-select-label">
                                            Role
                                        </InputLabel>
                                        <Select
                                            labelId="role-select-label"
                                            id="role-select"
                                            label="Role"
                                            error={errors.role}
                                            {...field}
                                        >
                                            <MenuItem
                                                    value={"client"}
                                                >
                                                    Property Buyer
                                                </MenuItem>
                                                <MenuItem
                                                    value={"agent"}
                                                >
                                                    Property Agent
                                                </MenuItem>
                                        </Select>
                                    </FormControl>
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
                    <p>Already have an account? <Link to="/login" className="underline">Login here!</Link></p>

                </div>
            </div>
        </div>
    );
};

export default Register;
