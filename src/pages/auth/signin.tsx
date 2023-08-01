import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { Box, TextField } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import Image from "next/image";

type Props = {};

interface IFormInput {
  username: string;
  password: string;
}

const Login = ({}: Props) => {
  const router = useRouter();
  const { data:session, status } = useSession();
  const [ error, setError ] = useState<string>("")
  const { handleSubmit, control } = useForm<IFormInput>(
      { defaultValues: {
          username: "",
          password: "",
        }
      })
  const onSubmit: SubmitHandler<IFormInput> = async(data) => { 
    const res = await signIn("credentials", { redirect: false, ...data } );
    if ( res?.status === 403 ) return setError("username or password incorrect.");
    router.push('/budget/disburse');
  }
  
  if ( status === "authenticated" ) router.replace("/budget/disburse");

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card sx={{ maxWidth: 350, borderRadius: "10px" }}>
          <CardMedia
            sx={{ height: 175, marginTop: "10px" }}
          >
            <Image src={"/static/banner_login.jpg"} alt={""} width={300} height={200}  />
          </CardMedia>
          <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              key="username"
              name="username"
              control={control}
              render={({ field }) => <TextField 
                                        sx={{ marginBottom: "15px", marginTop: "5px" }}
                                        label="username" 
                                        fullWidth 
                                        error={ error ? true : false}
                                        helperText={error}
                                        {...field} 
                                      />}
              rules={{ required: true }}
            />
            <Controller
              key="password"
              name="password"
              control={control}
              render={({ field }) => <TextField 
                                        sx={{ marginBottom: "15px" }}
                                        type="password" 
                                        label="password" 
                                        fullWidth 
                                        error={ error ? true : false}
                                        helperText={error}
                                        {...field} 
                                      />}
              rules={{ required: true }}
            />
            <Button 
              type="submit" 
              color="primary" 
              variant="contained" 
              fullWidth>
                Login
            </Button>
          </form>
          </CardContent>
        </Card>

        <style jsx global>
          {`
            body {
              min-height: 100vh;
              position: relative;
              margin: 0;
              text-align: center;
            }
          `}
        </style>
      </Box>
    </React.Fragment>
  );
};

export default Login;