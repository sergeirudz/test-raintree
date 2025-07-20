import { createFileRoute } from '@tanstack/react-router';
import UserDetails from '@/components/users/UserDetails';
import Layout from '@/components/layout/layout';

export const Route = createFileRoute('/users/$userId')({
  component: UserDetailComponent,
});

function UserDetailComponent() {
  const { userId } = Route.useParams();

  return (
    <Layout>
      <UserDetails userId={userId} />
    </Layout>
  );
}
