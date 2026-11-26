create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.raw_app_meta_data ->> 'role' is null then
    raise exception 'Las cuentas solo las crea el admin del campus.';
  end if;

  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), new.email),
    new.email,
    (new.raw_app_meta_data ->> 'role')::public.user_role
  );
  return new;
end;
$$;
