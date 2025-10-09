import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_SETTINGS, UPDATE_USER_SETTINGS } from '../graphql/settings';
import { toast } from 'sonner';

export const useUserSettings = () => {

  // Get user settings
  const { data, loading, error, refetch } = useQuery(GET_USER_SETTINGS, {
    onError: (error) => {
      toast.error(error.message)
     
    },
  });

  // Update user settings
  const [updateSettings, { loading: isUpdating }] = useMutation(UPDATE_USER_SETTINGS, {
    onError: (error) => {
      toast.error(error.message)

    },
    onCompleted: () => {
      toast.success('Settings updated successfully')
      refetch();
    },
  });

  return {
    settings: data?.getUserSettings,
    loading,
    error,
    updateSettings: (input: any) => updateSettings({ variables: { input } }),
    isUpdating,
  };
};
