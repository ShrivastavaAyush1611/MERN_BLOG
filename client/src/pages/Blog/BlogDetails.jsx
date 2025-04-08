import { RouteBlogAdd, RouteBlogEdit } from "@/helpers/RouteName";
import React, { useState } from "react";
import {
  RouteAddCategory,
  RouteEditCategory,
  RouteSignIn,
} from "@/helpers/RouteName";
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import Loading from "@/components/Loading";
import { deleteData } from "@/helpers/handleDelete";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

const BlogDetails = () => {
  const [refresh, setrefresh] = useState(false);
  
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-all`,
    {
      method: "get",
      credentials: "include",
    },
    [refresh]
  );

  const handleDelete = (id) => {
    const response = deleteData(
      `${getEnv("VITE_API_BASE_URL")}/blog/delete/${id}`
    );
    if (response) {
      setrefresh(!refresh);
      showToast("success", "Data deleted");
    } else {
      showToast("success", "Data not deleted");
    }
  };
// console.log("BlogDtata:",blogData)
  if (loading) return <Loading />;
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button>
              <Link to={RouteBlogAdd}>Add Blog</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Dated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {blogData && blogData.blog.length > 0 ? 
                    blogData.blog.map(blog =>
                    <TableRow key={blog._id}>
                      <TableCell>{blog?.author?.name}</TableCell>
                      <TableCell>{blog?.category?.name}</TableCell>
                      <TableCell>{blog?.title}</TableCell>
                      <TableCell>{blog?.slug}</TableCell>
                      <TableCell>{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>
                      
                      
                      <TableCell className="flex gap-3">
                         <Button variant="outline" className="hover:bg-violet-500 hover:text-white" asChild>
                             <Link to={RouteBlogEdit(blog._id)}>
                                <FaEdit />
                             </Link>
                         </Button>
                         <Button variant="outline" className="hover:bg-violet-500 hover:text-white" asChild>
                             <Link onClick={()=>{handleDelete(blog._id)}}>
                             <FaRegTrashAlt />
                             </Link>
                         </Button>
                      </TableCell>
                    </TableRow>
                    )

                  :
                  <TableRow>
                    <TableCell colSpan="6">
                        Data not Found
                    </TableCell>
                  </TableRow>  
                   
                }
          </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;
