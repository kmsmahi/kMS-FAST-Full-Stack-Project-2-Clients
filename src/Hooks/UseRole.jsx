import { useQuery } from '@tanstack/react-query';
import UseAuth from './UseAuth';

import UseAxios from './UseAxios';
const UseRole = () => {
  const { user, loading } = UseAuth();
  const axiosSecure = UseAxios(); 

  const { data: role = 'user', isLoading: roleLoading } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !loading && !!user?.email,
    staleTime: 0, 
    cacheTime: 0, 
    queryFn: async () => {
      
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      console.log("Fetched Role from Backend:", res.data);
      return res.data?.role || res.data || 'user';
    }
  });

  return [role, roleLoading];
};

export default UseRole;