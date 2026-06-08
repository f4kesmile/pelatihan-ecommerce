import { getAllUsers, getUserProfile } from "@/server/actions/user.actions";
import { UsersList } from "@/components/features/admin/users/users-list";

export default async function UsersPage() {
  const [result, userProfile] = await Promise.all([
    getAllUsers(),
    getUserProfile(),
  ]);

  const users = result.success && result.users ? result.users : [];

  const serializedUsers = JSON.parse(JSON.stringify(users));
  const serializedUserProfile = userProfile
    ? JSON.parse(JSON.stringify(userProfile))
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">User Management</h3>
        <p className="text-sm text-muted-foreground mt-1">
          View all registered users and manage their roles.
          <br />
          <span className="text-xs text-muted-foreground/80 mt-1 inline-block">
            * Super Admins cannot change their own role. Only Super Admins can
            manage other Super Admins.
          </span>
        </p>
      </div>

      <UsersList
        initialUsers={serializedUsers}
        currentUser={serializedUserProfile}
      />
    </div>
  );
}
