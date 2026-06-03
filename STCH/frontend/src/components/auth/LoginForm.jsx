import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";


const loginSchema = z.object({

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required")
});


function LoginForm() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [authError, setAuthError] =
    useState("");


  const {register, handleSubmit, formState: { errors }} = useForm({resolver: zodResolver(loginSchema)});


  const onSubmit = async (data) => {

    try {

      setAuthError("");

      const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response =
        await fetch(
          `${base}/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
              "application/json",
            },

            body: JSON.stringify(data),
          }
        );

      const result =
        await response.json();

      console.log(
        "LOGIN RESPONSE:",
        result
      );

      // LOGIN FAILED
      if (!response.ok) {

        setAuthError(

          result.detail ||

          result.error ||

          "Invalid email or password"
        );

        return;
      }

      // TOKEN MISSING
      if (!result.access_token) {

        setAuthError(
          "Login failed"
        );

        return;
      }

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        result.access_token
      );

      // SAVE USER
      login(result.user);

      // REDIRECT
      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      setAuthError(
        "Server error. Please try again."
      );
    }
  };


  return (

    <div className="
      w-full
      max-w-md
    ">

      {/* HEADER */}
      <div className="
        mb-10
      ">

        <h2 className="
          text-4xl
          font-semibold
          tracking-tight
          text-white
        ">

          Welcome Back

        </h2>

        <p className="
          mt-3
          text-zinc-500
        ">

          Login to continue
          to STCH OS.

        </p>

      </div>


      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)}
        className="
          space-y-6
        "
      >

        {/* EMAIL */}
        <div>

          <label className="
            block
            mb-2
            text-sm
            text-zinc-400
          ">

            Email

          </label>


          <input

            type="email"

            placeholder="Enter your email"

            {...register("email")}

            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-[#151821]
              border
              border-[#2A3142]
              text-white
              placeholder:text-zinc-600
              outline-none
              focus:border-blue-500
              transition-all
            "
          />


          {errors.email && (

            <p className="
              mt-2
              text-sm
              text-rose-400
            ">

              {errors.email.message}

            </p>

          )}

        </div>


        {/* PASSWORD */}
        <div>

          <label className="
            block
            mb-2
            text-sm
            text-zinc-400
          ">

            Password

          </label>


          <input

            type="password"

            placeholder="Enter your password"

            {...register("password")}

            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-[#151821]
              border
              border-[#2A3142]
              text-white
              placeholder:text-zinc-600
              outline-none
              focus:border-blue-500
              transition-all
            "
          />


          {errors.password && (

            <p className="
              mt-2
              text-sm
              text-rose-400
            ">

              {errors.password.message}

            </p>

          )}

        </div>


        {/* AUTH ERROR */}
        {authError && (

          <div className="
            rounded-2xl
            border
            border-rose-500/30
            bg-rose-500/10
            px-4
            py-3
            text-sm
            text-rose-400
          ">

            {authError}

          </div>

        )}


        {/* BUTTON */}
        <button

          type="submit"

          className="
            w-full
            py-3
            rounded-2xl
            bg-gradient-to-r
            from-blue-500
            to-violet-500
            text-white
            font-medium
            hover:scale-[1.02]
            transition-all
            duration-300
            shadow-lg
            shadow-blue-500/20
          "
        >

          Login

        </button>

      </form>

    </div>
  );
}


export default LoginForm;
