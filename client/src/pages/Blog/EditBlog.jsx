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
import { useNavigate, useParams } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";
import { useSelector } from "react-redux";
import {decode} from 'entities'
import Loading from "@/components/Loading";

const EditBlog = () => {
  const { blogid } = useParams()
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();

  const {data: categoryData} = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
    method: "get",
    credentials: "include",
  });
  const {data: blogData ,loading:blogLoading} = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/edit/${blogid}`, {
    method: "get",
    credentials: "include",
  },[blogid]);

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

  useEffect(() => {
    if (blogData) {
      setPreview(blogData.blog.featuredImage)
      form.setValue('category', blogData.blog.category._id); // Correct mapping
      form.setValue('title', blogData.blog.title); // Correct mapping
      form.setValue('slug', blogData.blog.slug); // Correct mapping
      form.setValue('blogContent', decode(blogData.blog.blogContent)); // Correct mapping
    }
  }, [blogData]);
  // console.log(blogData.blog.category._id)

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
      

      // const newValues = { ...values, author: user.user._id }; // Ensure author is correctly set
      // if (!newValues.author) {
      //   return showToast("error", "Please Login");
      // }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/update/${blogid}`, {
        method: "put",
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

  if(blogLoading) return <Loading/>
  return (
    <div>
      <Card className="pt-5 ">
        <CardContent>
        <h1 className="text-4xl font-bold mb-4 underline">Edit Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-8">
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData &&
                              categoryData.category.length > 0 &&
                              categoryData.category.map((category) => (
                                <SelectItem
                                  key={`${category._id}-${category.name}`}
                                  value={category._id} // Use category ID
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
                  {/* {console.log(field.value)} */}
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl>
                      <div className="border w-full rounded-md p-2 bg-white overflow-hidden">
                        <Editor
                          props={{
                            initialData: form.getValues("blogContent"), // Ensure initial data is fetched
                            onChange: handleEditorData,
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

export default EditBlog;
