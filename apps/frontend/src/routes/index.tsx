import { createFileRoute } from '@tanstack/react-router';

import UsersTable from '@/components/users/UsersTable';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return <UsersTable />;
}
