import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { FaRegComment } from "react-icons/fa";
import { Button } from './ui/button';
import Loading from './Loading';

const CommentCount = ({props}) => {
     const { data, loading, error } = useFetch(
        `${getEnv("VITE_API_BASE_URL")}/comment/get-count/${props.blogid}`,
        {
          method: "get",
          credentials: "include",
        }
      );
      if(loading) return <Loading/>
  return (
    <button type='button' className='flex justify-between items-center gap-1'>
        <FaRegComment />
        {data && data.commentCount}
    </button>
  )
}

export default CommentCount
