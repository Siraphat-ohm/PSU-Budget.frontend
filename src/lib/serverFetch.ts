import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { axiosServer } from './axios';

interface Props {
  data: string;
}

export async function serverFetch(context: GetServerSidePropsContext, endpoint: string): Promise<Props> {
  const session = await getSession(context);
  const token = session?.user?.accessToken;

  if (!token) {
    // Handle the case when token is missing
    console.log("Token is missing in session:", session);
    throw new Error("Token is missing in session");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axiosServer.get(endpoint, { headers });
    const data = response.data;

    return { data };
  } catch (error) {
    throw error;
  }
}