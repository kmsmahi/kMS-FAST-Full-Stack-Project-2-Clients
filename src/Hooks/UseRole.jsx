import { useQuery } from '@tanstack/react-query';
import UseAuth from './UseAuth';
import axios from 'axios';

const UseRole = () => {
  const { user, loading } = UseAuth();

  const { data: role = 'user', isLoading: roleLoading } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      // If you use a secure axios instance, replace `axios` with `axiosSecure`
      const res = await axios.get(`http://localhost:5000/users/role/${user.email}`);
      return res.data?.role;
    }
  });

  return [role, roleLoading];
};

export default UseRole;