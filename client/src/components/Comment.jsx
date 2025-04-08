import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RouteSignIn } from "@/helpers/RouteName";
// import { useFetch } from "@/hooks/useFetch";
import CommentList from "./CommentList";
// import { LiaCarSolid } from "react-icons/lia";

const Comment = ({ props }) => {
    const [newComment,setnewComment] = useState()

  const user = useSelector((state) => state.user);
  const formSchema = z.object({
    comment: z.string().min(3, "Comment must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  // console.log(user)
  async function onSubmit(values) {
    try {
      const newValues = {
        ...values,
        blogid: props.blogid,
        user: user?.user?._id, // Ensure user ID is passed correctly
      };

      if (!newValues.user) {
        return showToast("error", "Please log in to comment.");
      }

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/comment/add`,
        {
          method: "post",
          credentials:'include',
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(newValues),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message);
      } else {
        setnewComment(data.comment);
        form.reset();
        showToast("success", data.message);
      }
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold">
        {" "}
        <FaComment className="text-violet-500" /> Comment
      </h4>
      {user && user.isLoggedIn ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="py-8">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your comment..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              submit
            </Button>
          </form>
        </Form>
      ) : (
        <Button asChild>
          <Link to={RouteSignIn}>Sign In</Link>
        </Button>
      )}

      <div className="mt-5">
        <CommentList props={{ blogid: props.blogid,newComment}} />
      </div>
    </div>
  );
};

export default Comment;
