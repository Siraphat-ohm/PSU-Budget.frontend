import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

type Props = {}

const Index = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/budget/disburse');
  }, []);

  return <div>Loading...</div>;
}

export default Index;
