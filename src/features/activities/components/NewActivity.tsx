import EmptyState from '@/components/EmptyState';
import Loading from '@/components/Loading';
import { MINIMUM_PARTICIPANT_COUNT } from '@/constants';
import ActivityForm from '@/features/activities/components/ActivityForm';
import { useMembers } from '@/features/members/hooks/useMembers';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';

import type { ActivityCreateSchema } from '@/features/activities/validation';
import type { PostResponseData } from '@/pages/api/activities';

const NewActivity = () => {
  const router = useRouter();
  const { members, isLoading: loadingMembers } = useMembers();
  const { places, isLoading: loadingPlaces } = usePlaces();
  const { trigger, isMutating } = useSWRMutation(
    '/api/activities',
    (url: string, { arg }: { arg: ActivityCreateSchema }) => {
      return axios
        .post<PostResponseData>(url, arg)
        .then((response) => response.data);
    },
  );

  const handleSubmit = async (fieldValues: ActivityCreateSchema) => {
    try {
      const { activity } = await trigger(fieldValues);
      await router.push(`/activities/${activity.id}`);
      toast.success('アクティビティを開始しました。');
    } catch {
      toast.error('アクティビティを開始できませんでした。');
    }
  };

  if (loadingMembers || loadingPlaces) {
    return <Loading />;
  }

  console.log(members.length);
  if (members.length < MINIMUM_PARTICIPANT_COUNT) {
    return (
      <EmptyState src="/images/looking-for-friends.png" alt="exploring">
        <div className="text-center leading-7">
          <p>アクティビティを開始するには 2 名以上のメンバーが必要です。</p>
          <p>
            {/* todo: add shared style to Next.js link component */}
            <Link href="/members">メンバーを登録</Link>
            しましょう。
          </p>
        </div>
      </EmptyState>
    );
  }
  if (places.length === 0) {
    return (
      <EmptyState src="/images/exploring-the-globe.png" alt="exploring">
        <div className="text-center leading-7">
          <p>
            アクティビティを開始するには、
            {/* todo: add shared style to Next.js link component */}
            <Link href="/settings/places/">場所の登録</Link>が必要です。
          </p>
        </div>
      </EmptyState>
    );
  }

  return (
    <ActivityForm
      members={members}
      places={places}
      isSubmitting={isMutating}
      onSubmit={handleSubmit}
    />
  );
};

export default NewActivity;
