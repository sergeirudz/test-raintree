import CreateUserForm from '@/components/users/CreateUserForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-user')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateUserForm />;
}
