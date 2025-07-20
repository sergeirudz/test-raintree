import { createFileRoute } from '@tanstack/react-router';
import UserDetails from '@/components/users/UserDetails';

export const Route = createFileRoute('/users/$userId')({
  component: UserDetailComponent,
});

function UserDetailComponent() {
  const { userId } = Route.useParams();

  return <UserDetails userId={userId} />;
}
