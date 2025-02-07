import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = ({ query }) => {
  const activityId = query.activityId as string;

  return Promise.resolve({
    redirect: {
      permanent: true,
      destination: `/activities/${activityId}`,
    },
  });
};

const Page = () => null;

export default Page;
