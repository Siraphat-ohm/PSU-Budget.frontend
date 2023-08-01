import { useSession } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/router';

type Props = {}

const index = ({}: Props) => {
  const router = useRouter();
  const { data:session, status } = useSession();
  if ( status == "authenticated" ) {
    router.replace("/budget/disburse");
  } else if ( status == "unauthenticated" ) {
    router.replace("/auth/signin")
  }
  
  return (
    <div>
    </div>
  )
}


export default index;