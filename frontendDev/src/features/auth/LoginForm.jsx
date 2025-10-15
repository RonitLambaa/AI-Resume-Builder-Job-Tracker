import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { Button, Input} from "../../components";
import { login as authLogin } from "./authSlice"; 
import authApi from "../../api/authApi"; // Axios wrapper for backend calls

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
  setServerError("");
  try {
    const res = await authApi.login(data); 
    console.log("Login response:", res.data);

    const { user, AccessToken, RefreshToken } = res.data.data;

    if (user) {
      // Save user in Redux
      dispatch(authLogin(user));

      // Save tokens in localStorage
      localStorage.setItem("accessToken", AccessToken);
      localStorage.setItem("refreshToken", RefreshToken);

      // Navigate to dashboard
      navigate("/dashboard");
    } else {
      setServerError("Invalid credentials");
    }
  } catch (err) {
    setServerError(err.response?.data?.message || "Invalid credentials");
  }
};


  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl p-10 border border-black/10 shadow-lg">
        <h2 className="text-center text-2xl font-bold">Sign in to your account</h2>
        <p className="mt-2 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {serverError && (
          <p className="text-red-600 text-center mt-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Enter a valid email address",
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            error={errors.password?.message}
          />

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
