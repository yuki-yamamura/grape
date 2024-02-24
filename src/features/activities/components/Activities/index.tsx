import Loading from '@/components/Loading';
import PlusButton from '@/components/PlusButton';
import ActivityTable from '@/features/activities/components/ActivityTable';
import { useActivities } from '@/features/activities/hooks/useActivities';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import type { Activity } from '@/types/models/Activity';

const Activities = () => {
  const router = useRouter();
  const { activities, isLoading, mutate } = useActivities();

  const handlePlusButtonClick = async () => {
    await router.push('/activities/new');
  };

  const closeActivityById = async (id: Activity['id']) => {
    try {
      await axios.put(`/api/activities/${id}`, {
        isOpen: false,
      });
      await mutate();
      toast.success('アクティビティを終了しました。');
    } catch {
      toast.error('アクティビティを終了できませんでした。');
    }
  };
  const deleteActivityById = async (id: Activity['id']) => {
    try {
      await axios.delete(`/api/activities/${id}`);
      await mutate();
      toast.success('アクティビティを削除しました。');
    } catch {
      toast.error('アクティビティを削除できませんでした。');
    }
  };
  const openActivity = async (id: Activity['id']) => {
    await router.push(`/activities/${id}`);
  };

  if (isLoading) {
    return <Loading text="アクティビティを読み込んでいます..." />;
  }

  return (
    <div>
      <PlusButton onClick={handlePlusButtonClick} />
      <ActivityTable
        data={activities}
        actions={{
          closeActivityById,
          deleteActivityById,
          openActivity,
        }}
      />
    </div>
  );
};

export default Activities;
