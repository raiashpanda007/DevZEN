import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/Auth/auth_Config";


const verifyUser = async () => {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  
  return session ? session.user : null;
};
export default verifyUser;

