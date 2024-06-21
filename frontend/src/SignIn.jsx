import React from "react";
import useQuestionBank from "./hooks/useQuestionBank";
import { CircularProgress, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButton";
import { getAwsCredentials, getCognitoUser } from "./CognitoHelper";
import { Link } from "react-router-dom";

const login_schema = yup
    .object({
        username: yup.string().required("Username is required"),
        password: yup
            .string()
            .min(8, "Password must be atleast 8 characters")
            .required("Password is required"),
    })
    .required();

const security_question_schema = yup
    .object({
        answer: yup.string().required("Answer is required"),
    })
    .required();

const caesar_schema = yup
    .object({
        answer: yup.string().required("Answer is required"),
    })
    .required();

const SignIn = () => {
    const { questionBank, isLoading, error } = useQuestionBank();
    const [formState, setFormState] = React.useState(0);
    const [question, setQuestion] = React.useState(null);
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const cognitoUserRef = React.useRef(null);
    const q_text = questionBank?.find((q) => q.q_id === question)?.q || "";
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(login_schema),
    });
    const {
        handleSubmit: handleSubmitSecurity,
        control: controlSecurity,
        formState: { errors: errorsSecurity },
    } = useForm({
        resolver: yupResolver(security_question_schema),
    });
    const {
        handleSubmit: handleSubmitCaesar,
        control: controlCaesar,
        formState: { errors: errorsCaesar },
    } = useForm({
        resolver: yupResolver(caesar_schema),
    });
    const submitUsernamePassword = (data) => {
        setButtonLoading(true);
        const creds = getAwsCredentials(data.username, data.password);
        if(!cognitoUserRef.current){
            const cognitoUser = getCognitoUser(data.username);
            cognitoUserRef.current = cognitoUser;
        }
        const cognitoUser = cognitoUserRef.current;
        cognitoUser.setAuthenticationFlowType("CUSTOM_AUTH");
        cognitoUser.authenticateUser(creds, {
            onSuccess: (result) => {
                window.location.reload();
            },
            onFailure: (err) => {
                console.error("Authentication failed:", err);
            },
            customChallenge: (challengeParameters) => {
                console.log("Custom challenge:", challengeParameters);
                if (challengeParameters.type === "SECURITY_QUESTION") {
                    setFormState(1);
                    setQuestion(challengeParameters.securityQuestion);
                } else if (challengeParameters.type === "CAESAR") {
                    setFormState(2);
                    setQuestion(challengeParameters.securityQuestion);
                }
                setButtonLoading(false);
            },
        });
    };

    const submitCustomChallenge = (data) => {
        setButtonLoading(true);
        const cognitoUser = cognitoUserRef.current;
        cognitoUser.sendCustomChallengeAnswer(data.answer, {
            onSuccess: (result) => {
                window.location.replace("/");
            },
            onFailure: (err) => {
                console.error("Authentication failed:", err);
            },
            customChallenge: (challengeParameters) => {
                console.log("Custom challenge:", challengeParameters);
                if (challengeParameters.type === "SECURITY_QUESTION") {
                    setFormState(1);
                    setQuestion(challengeParameters.securityQuestion);
                } else if (challengeParameters.type === "CAESAR") {
                    setFormState(2);
                    setQuestion(challengeParameters.securityQuestion);
                }
                setButtonLoading(false);
            },
        });
    };

    if (isLoading)
        return (
            <div className="h-screen flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    if (error) return <div>Error: {error}</div>;
    return (
        <div>
            <div className="flex p-8 h-screen">
                <div className="basis-1/2">
                    {/* Photo by <a href="https://unsplash.com/@ollipexxer?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Oliver Pecker</a> on <a href="https://unsplash.com/photos/jet-black-iphone-7-beside-analog-watch-HONJP8DyiSM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a> */}
                    <img
                        className="bg-black h-full w-full rounded-3xl object-cover"
                        src="/assets/banner.jpg"
                        alt="bg"
                    />
                </div>
                <div className="relative basis-1/2 p-24 flex flex-col justify-center">
                    <div className="absolute top-0">DalVacationHome</div>
                    <Typography className="text-center" variant="h4">
                        Login
                    </Typography>
                    {formState === 0 && (
                        <form onSubmit={handleSubmit(submitUsernamePassword)}>
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
                                <CustomButton
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                >
                                    {buttonLoading ? <CircularProgress color="secondary" size="20px"/> : "Login"}
                                </CustomButton>
                            </div>
                        </form>
                    )}
                    {formState === 1 && (
                        <form
                            onSubmit={handleSubmitSecurity(submitCustomChallenge)}
                        >
                            <div className="my-3">
                                <Typography>{q_text}</Typography>
                                <Controller
                                    name="answer"
                                    control={controlSecurity}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Answer"
                                            error={errorsSecurity.answer}
                                            helperText={
                                                errorsSecurity.answer
                                                    ?.message || undefined
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
                                    {buttonLoading ? <CircularProgress color="secondary" size="20px"/> : "Submit"}
                                </CustomButton>
                            </div>
                        </form>
                    )}
                    {formState === 2 && (
                        <form onSubmit={handleSubmitCaesar(submitCustomChallenge)}>
                            <div className="my-3">
                                <Typography>
                                    Decipher following CAESAR cipher using the
                                    key you set during registeration: {question}
                                </Typography>
                                <Controller
                                    name="answer"
                                    control={controlCaesar}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Answer"
                                            error={errorsCaesar.answer}
                                            helperText={
                                                errorsCaesar.answer?.message ||
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
                                    {buttonLoading ? <CircularProgress color="secondary" size="20px" /> : "Submit"}
                                </CustomButton>
                            </div>
                        </form>
                    )}
                    <p>Don't have an account? <Link to="/register" className="underline">register here!</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
