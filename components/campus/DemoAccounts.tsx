import { users } from "@/data/users";

interface DemoAccountsProps {
  onSelect: (email: string, password: string) => void;
}

export function DemoAccounts({ onSelect }: DemoAccountsProps) {
  return (
    <div className="border-t border-line pt-6">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
        Cuentas de demostración
      </p>
      <ul className="mt-4 flex flex-col gap-2">
        {users.map((user) => (
          <li key={user.id}>
            <button
              type="button"
              onClick={() => onSelect(user.email, user.password)}
              className="flex w-full items-center justify-between gap-4 border border-line bg-surface px-4 py-3 text-left text-sm transition-colors hover:border-primary"
            >
              <span className="text-foreground">{user.email}</span>
              <span className="text-xs uppercase tracking-[0.18em] text-primary">{user.role}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
