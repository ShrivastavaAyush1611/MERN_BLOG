import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory, RouteSignIn } from "@/helpers/RouteName";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
// import { useSelector } from "react-redux";

function CoategoryDetails() {
// const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Access isLogedin from Redux
const [refresh, setrefresh] = useState(false);

  const {data: categoryData ,loading,error}=useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`,{
    method:'get',
    credentials:'include'
  },[refresh])

  const handleDelete = (id)=>{
    const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/category/delete/${id}`)
    if(response){
      setrefresh(!refresh)
      showToast('success' , 'Data deleted')
    }else{
      showToast('success' , 'Data not deleted')
    }
  }

  if(loading) return <Loading/>
  // if(isLogedin) {
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button>
              <Link to={RouteAddCategory}>Add Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {categoryData && categoryData.category.length > 0 ? 
                      categoryData.category.map(category =>
                      <TableRow key={category._id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell className="flex gap-3">
                           <Button variant="outline" className="hover:bg-violet-500 hover:text-white" asChild>
                               <Link to={RouteEditCategory(category._id)}>
                                  <FaEdit />
                               </Link>
                           </Button>
                           <Button variant="outline" className="hover:bg-violet-500 hover:text-white" asChild>
                               <Link onClick={()=>{handleDelete(category._id)}}>
                               <FaRegTrashAlt />
                               </Link>
                           </Button>
                        </TableCell>
                      </TableRow>
                      )

                    :
                    <TableRow>
                      <TableCell colSpan="3">
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
// }else{
// return <RouteSignIn />;
// }
}

export default CoategoryDetails;
