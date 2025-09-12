// CallbackPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function CallbackPage() {
    const { login , setUser} = useAuth();
  
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const token = searchParams.get(`accessToken`)
    console.log(token)

    localStorage.setItem('access_Token', token)
    if (token) {
        navigate('/main')
    } else {
        navigate('/login')
    }

//     useEffect(() => {
//         if (token) {
//             const fetchUser = async () => {
//         try {
//             console.log('123456')
            
//           const res = await api.get('api/v1/users/me', {
//               headers: {
//                   Authorization: `Bearer ${token}`
//               }
//           }
//         );
//         const userData = res.data.userWithoutPassword;

//             const hasAdminRole = userData?.roles?.map(role => role.name).includes('admin')
//             console.log(hasAdminRole)
//         navigate(hasAdminRole ? "/admin" : "/main", { replace: true });
//       } catch (err) {
//         navigate("/login", { replace: true });
//       }
//     };
//         fetchUser();
//     }
//   }, [token]);

  return <p>Đang xử lý đăng nhập...</p>;
}
