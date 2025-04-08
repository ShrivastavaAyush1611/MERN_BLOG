import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { RouteIndex, RouteSignUp } from "@/helpers/RouteName";
import { Link,useNavigate } from "react-router-dom";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import GoogleLogin from "@/components/GoogleLogin";
import logo from '@/assets/images/logo-white.png'


function SignIn() {
 
  const [isLogedin,setisLogedin] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3, "Password Field required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/login`,
        {
          method: "post",
          headers: { "Content-type": "application/json" }, // Ensures we are sending JSON data.
          credentials: "include", //This tells the browser to include cookies in the request.
          //Without this, the JWT cookie will not be sent to the backend.
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      dispatch(setUser(data.user));
      navigate(RouteIndex);
      setisLogedin(true);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-[400px] p-5">
      <div className="mb-2 flex justify-center items-center">
      <Link to={RouteIndex}>
      <img src={logo} />
      </Link>
      </div>
      <h1 className="text-2xl font-bold text-center mb-5">Login Into Account</h1>
      <div>
      <GoogleLogin />
      <div className='border mt-5 flex justify-center items-center'>
        <span className='absolute bg-white text-sm'>Or</span>
      </div>
      </div>
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-8">
          <div className="mb-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

         <div className="mt-5">
          <Button type="submit" className="w-full">
            Sign-In
          </Button>
           <div className="mt-5 text-sm flex justify-center items-center gap-2">
            <p>Don&apos;t have account?</p>
            <Link className="text-blue-500 hover:underline" to={RouteSignUp}>Sign Up</Link>
           </div>
          </div>
        </form>
        </Form>
      </Card>
    </div>
  );
}

export default SignIn;
