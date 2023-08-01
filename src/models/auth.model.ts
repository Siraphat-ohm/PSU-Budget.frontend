import { DefaultUser } from "next-auth";

export interface IUser extends DefaultUser { 
    username: string,
    firstname: string,
    lastname: string,
    accessToken: string,
    allowLogin: boolean,
}