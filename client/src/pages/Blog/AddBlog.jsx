import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import { CiCirclePlus } from "react-icons/ci";
import Editor from "@/components/ui/Editor"; // Ensure correct import path
import { useNavigate } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";
import { useSelector } from "react-redux";

const AddBlog = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // console.log("User state:", user); // Debugging
  // console.log("Author ID:", user?._id); // Debugging

  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
    method: "get",
    credentials: "include",
  });

  // console.log(categoryData)

  const formSchema = z.object({
    category: z.string().min(3, "Category must be at least 3 characters long"),
    title: z.string().min(3, "Title must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    blogContent: z
      .string()
      .min(3, "BlogContent must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });
  const blogTitle = form.watch("title");
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    } else {
      form.setValue("slug", ""); // Clear slug when name is empty
    }
  }, [blogTitle]); // Add dependency array

  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    // console.log(data)
    form.setValue("blogContent", data);
  };

  async function onSubmit(values) {
    console.log(values);
    try {
      if (!file) {
        return showToast("error", "Feature image required.");
      }

      const newValues = { ...values, author: user.user._id }; // Ensure author is correctly set
      if (!newValues.author) {
        return showToast("error", "Please Login");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(newValues));

      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/add`, {
        method: "post",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message || "Failed to add blog.");
      }

      form.reset();
      setFile();
      setPreview();
      navigate(RouteBlog);
      showToast("success", data.message || "Blog added successfully.");
    } catch (error) {
      showToast("error", error.message || "An error occurred.");
    }
  }

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setPreview(preview);
  };
  return (
    <div>
      <Card className="pt-5 ">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-8">
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl onValueChange={field.onChange}>
                        <Select {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData &&
                              categoryData.category.length > 0 &&
                              categoryData.category.map((category) => (
                                <SelectItem
                                  key={`${category.id}-${category.name}`}
                                  value={category.name}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Blog Title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your slug..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <span className="mb-2 block">Featured Image</span>
                <Dropzone
                  onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed rounded ">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <CiCirclePlus size={24} />
                        )}
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>

              <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl className="">
                      <div className="border w-full rounded-md p-2 bg-white overflow-hidden">
                        <Editor
                          initialData=""
                          onChange={handleEditorData}
                          config={{
                            height: 300, // Set a fixed height
                            resize_enabled: false, // Disable manual resizing
                            width: "100%", // Force it to stay inside the container
                            toolbarLocation: "top",
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-5">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
