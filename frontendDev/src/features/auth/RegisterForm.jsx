import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { Button, Input } from "../../components";
import { login as authLogin } from "./authSlice"; // reuse auth slice
import authApi from "../../api/authApi";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      // Call backend signup
      const res = await authApi.signup(data);
      // res should return { user, AccessToken, RefreshToken }

      if (res.data?.data?.user) {
        // save user to Redux
        dispatch(authLogin(res.data.data.user));

        // save tokens to localStorage
        localStorage.setItem("accessToken", res.data.data.AccessToken);
        localStorage.setItem("refreshToken", res.data.data.RefreshToken);

        // redirect
        navigate("/dashboard");
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl p-10 border border-black/10 shadow-lg">

        <h2 className="text-center text-2xl font-bold">Create your account</h2>
        <p className="mt-2 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>

        {serverError && (
          <p className="text-red-600 text-center mt-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name (optional)"
            type="text"
            {...register("fullname")}
          />

          <Input
            label="Username"
            placeholder="Enter your username"
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
            })}
            error={errors.username?.message}
          />

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
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
