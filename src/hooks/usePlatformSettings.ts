import { useQuery, useMutation } from '@apollo/client';
import { GET_PLATFORM_SETTINGS, UPDATE_PLATFORM_SETTING } from '../graphql/settings';
import { toast } from 'sonner';

export const usePlatformSettings = (page = 1, limit = 20, filters = {}) => {

  // Get platform settings
  const { data, loading, error, refetch } = useQuery(GET_PLATFORM_SETTINGS, {
    variables: { page, limit, filters },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      toast.error(error.message)
     
    },
  });

  // Update platform setting
  const [updateSetting, { loading: isUpdating }] = useMutation(UPDATE_PLATFORM_SETTING, {
    onError: (error) => {
      toast.error(error.message)

     
    },
    onCompleted: () => {
      toast.success('Setting updated successfully')
     
      refetch();
    },
  });

  return {
    settings: data?.getPlatformSettings?.items || [],
    pagination: data?.getPlatformSettings?.pagination || {
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: limit,
    },
    loading,
    error,
    updateSetting: (input: { key: string; value: string; description?: string }) =>
      updateSetting({ variables: { input } }),
    isUpdating,
    refetch,
  };
};
