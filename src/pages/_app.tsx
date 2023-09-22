import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

interface IProps extends AppProps  {
  session : any
}

export default function App({ Component, pageProps }: IProps ) {
  
  return (  
    <SessionProvider session={pageProps.session}>
      <LocalizationProvider dateAdapter={ AdapterDayjs }>
        <Component {...pageProps} /> 
      </LocalizationProvider>
    </SessionProvider>
  )
}