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
    gcTime: 0,
    retry: 1,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data?.role || 'user';
    }
  });

  return [role, roleLoading];
};

export default UseRole;