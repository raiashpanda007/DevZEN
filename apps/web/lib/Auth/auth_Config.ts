import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { NextAuthOptions } from 'next-auth';
import {prisma} from '@workspace/db/';

 const NEXT_AUTH_CONFIG : NextAuthOptions = {
    providers :[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
        }),
        
    ],secret: process.env.SECRET,
}
export default NEXT_AUTH_CONFIG;