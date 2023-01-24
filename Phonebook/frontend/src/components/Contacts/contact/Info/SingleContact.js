import React from 'react'
import { useParams } from 'react-router-dom'

function SingleContact() {
    const params=useParams()
    console.log(params)
  return (
    <div>{params.postId}</div>
  )
}

export default SingleContact