import Comment from "@/components/Comment";
import Loading from "@/components/Loading";
import { Avatar } from "@/components/ui/avatar";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { AvatarImage } from "@radix-ui/react-avatar";
import moment from "moment";
import { decode } from "entities";

import React from "react";
import { useParams } from "react-router-dom";
import CommentList from "@/components/CommentList";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import RelatedBlog from "@/components/RelatedBlog";

const SingleBlogDetails = () => {
  const { blog,category } = useParams();
  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blog}`,
    {
      method: "get",
      credentials: "include",
    }
  );
//  console.log(data)
  if (loading) return <Loading />;

  return (
    <div className=" md:flex-nowrap flex-wrap flex justify-between gap-20">
      {data && data.blog && (
        <>
          <div className="border rounded md:w-[70%] w-full p-5">
            <h1 className="text-2xl font-bold mb-5 ">{data.blog.title}</h1>
            <div className="flex justify-between items-center">
               <div className="flex justify-between items-center gap-3">
               <Avatar>
                  <AvatarImage src={data.blog.author.avatar} />
                </Avatar>
                <div>
                  <p className="font-bold">{data.blog.author.name}</p>
                  <p>Date: {moment(data.blog.createdAt).format("DD-MM-YYYY")} </p>
                </div>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <LikeCount props={{blogid:data.blog._id}}/>
                  <CommentCount props={{blogid:data.blog._id}}/>
                </div>
              </div>
            <div className="my-5">
              <img src={data.blog.featuredImage} className="rounded" />
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: decode(data.blog.blogContent) || "",
              }}
            ></div>
            <div className="border-t mt-5 pt-5">
              <Comment props={{ blogid:data.blog._id }}/>
            </div>
            {/* <div className="border-t mt-5 pt-5">
              <CommentList props={{ blogid:data.blog._id }} />
            </div> */}
          </div>
        </>
      )}
      <div className="border rounded md:w-[30%] w-full p-5">
        <RelatedBlog props={{ category: category, currentBlog: blog }} />
      </div>
    </div>
  );
};

export default SingleBlogDetails;
