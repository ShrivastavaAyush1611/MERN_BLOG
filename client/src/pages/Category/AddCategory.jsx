import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from '@/components/ui/card';
import slugify from 'slugify';
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';
const AddCategory = () => {
 
const formSchema = z.object({
      name: z.string().min(3,"Name must be at least 3 characters long"),
    slug: z.string().min(3,"Slug must be at least 3 characters long"),
    });
  
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name:"",
        slug: "",
      },
    });
    const categoryname = form.watch('name');
    useEffect(() => {
      if (categoryname) {
        const slug = slugify(categoryname, { lower: true });
        form.setValue('slug', slug);
      } else {
        form.setValue('slug', ''); // Clear slug when name is empty
      }
    },[categoryname]); // Add dependency array
   
   async function onSubmit(values) {
      try {
        console.log(getEnv('VITE_API_BASE_URL'))
        const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/add`,{
          method:"post",
          headers:{'Content-type' : 'application/json'},
          body: JSON.stringify(values)
        })
        const data = await response.json()
       console.log(data)
        if(!response.ok){
           showToast('error',data.message)
        }
        form.reset();
        showToast('success', data.message);
      } catch (error) {
        showToast('error',error.message)
      }
    }



  return (
    <div>
    <Card className="pt-5 max-w-screen-md mx-auto">
    <CardContent>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-8">
        <div className="mb-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Name..." {...field} />
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

       

       <div className="mt-5">
        <Button type="submit" className="w-full">
          submit
        </Button>
        </div>
      </form>
      </Form>
    </CardContent>
    
    </Card>
  </div>
  )
}

export default AddCategory