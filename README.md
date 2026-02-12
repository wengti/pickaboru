
<div align='center'>
    <img src="/public/images/logo-banner.png"/>
</div>

# Pickaboru
A website for renting pickleball paddles, featuring
* user's authentication and authorization
* user's profiling
* administration features
* community interactive features (reviews and instant chat & notifications)

The implementation is fully front-end, implemented using ***React***, ***React-router*** and ***Supabase***
* routes are protected using authentication from Supabase (via JWT)
* data in supabase are protected using Row Level Security (RLS) policy.

## Get started
* Visit the implementation here: https://pickaboru.onrender.com/
* Click on the video to explore the implemented features: https://youtu.be/UeWfgmJQAUM

<div align='center'>
    <img src="/demo/demo1.png" width='48%'>
    <img src="/demo/demo2.png" width='48%'>
</div>

<div align='center'>
    <img src="/demo/demo3.png" width='48%'>
    <img src="/demo/demo4.png" width='48%'>
</div>

<div align='center'>
    <img src="/demo/demo5.png" width='48%'>
    <img src="/demo/demo6.png" width='48%'>
</div>

<div align='center'>
    <img src="/demo/demo7.png" width='48%'>
    <img src="/demo/demo8.png" width='48%'>
</div>

<div align='center'>
    <img src="/demo/demo9.png" width='48%'>
    <img src="/demo/demo10.png" width='48%'>
</div>

<div align='center'>
    <img src="/demo/demo11.png" width='48%'>
    <img src="/demo/demo12.png" width='48%'>
</div>

<div align='center'>
    <img src="/demo/demo13.png" width='48%'>
    <img src="/demo/demo14.png" width='48%'>
</div>

## Key takeaways / Improvements for future projects
* Learn wireframing and do proper UI design in advance
    - reduce the need of writing repeated code by writing reusable React components

* Consider using readily available React components instead of rewriting one from scratch.

* Improve organization of Supabase's
    - policies
    - constraints
    - triggers

## Notes for Supabase
Key references: https://supabase.com/docs/reference/javascript/introduction

1) Database

```javascript
async function fetchOrderData() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                paddle: items(*),
                seller: users!orders_seller_id_fkey(name),
                buyer: users!orders_buyer_id_fkey(name)
                )
            `)
            .eq('has_chatroom', true)
            .or(`seller_id.eq.${currentUser?.id}, buyer_id.eq.${currentUser?.id}`)
            .order('latest_chat', {ascending: false})
        if (error) {
            throw error
        }

        setOrderData(data)
    }
    catch (error) {
        setError(error)
    }
}
```
- `seller: users!orders_seller_id_fkey(name),` refers to
    *  fetching `name` column from `users` table
    * using the column with `orders_seller_id_fkey` from `orders` as foreign key
    * rename as `seller`

2) Auth setup
```javascript
// Retrive a session
useEffect( () => {
    async function fetchSession() {
        try{
            const {data, error} = await supabase.auth.getSession()
            if(error){
                throw error
            }
            setError(null)
            setSession(data.session)
        }
        catch(err){
            setError(err)
        }
    }

    fetchSession()
}, [])
```

``` javascript
// Listen for auth event change
useEffect( () => {
    const {data} = supabase.auth.onAuthStateChange( (_event, session) => {
        setSession(session)
    })

    return () => {data.subscription.unsubscribe()}
}, [])
```

3) Trigger - template code
```sql
create or replace function public.handle_new_users()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  INSERT INTO public.users(id, name, email, location)
  VALUES(new.id, new.raw_user_meta_data ->> 'name', new.email, new.raw_user_meta_data ->> 'location');
  return new;
end;
$$;

create trigger update_users_trigger
after INSERT on auth.users
for each row
execute function public.handle_new_users()
```

- `auth.users` is a table setup by default by Supabase
    - This trigger is triggered when a new user signs up (lead to a new INSERT on auth.users)
    - The triggers will then create a new row in the `public.users`
    - The purpose of this trigger is because `auth.users` can be modified by users (since front-end anon keys of supabase are used)
    - Meanwhile, `public.users` can be protected using RLS policies.

- `new.raw_user_meta_data ->> 'name'`
    - raw_user_meta_data is a column consisting of JSON object
    - therefore the syntax `->> 'name'` is needed to access the particular key of that JSON object.

- ` security definer set search_path = '' `
    - prevents sql injections

4) Add constraints

```sql
    ALTER TABLE public.items 
    ADD CONSTRAINT unique_user_item_name 
    UNIQUE (user_id, name);
```
- This ensures `items` table each row must be unique in the combination of `user_id` and `name` columns.


5) Policy
* By default - each tables are restrictives
* Policies are set to grant permission when users meet certain conditions.

```sql
alter policy "Only existing authenticated users can update item for themselv"
on "public"."items"
to authenticated
using (
  (
    (EXISTS 
      ( 
        SELECT 1 FROM users 
        WHERE ((auth.uid() = users.id) 
        AND (users.role = 'admin'::text))
      )
    ) 
    OR 
    (
      ( SELECT auth.uid() AS uid) = user_id
    )
  )
) with check (
  (
    (
        EXISTS ( SELECT 1 FROM users WHERE ( (users.id = auth.uid()) AND (users.role = 'admin'::text) ) ) -- AN ADMIN can update any cols to any value
    ) 
    OR
    (
        (
            status <> 'listed'::text --modified row cannot be in the listed status (because you are not an admin)
        )
        AND
        ( 
            user_id = ( SELECT auth.uid() AS uid) -- modified row has the same id as the current user
        ) 
        AND 
        (EXISTS ( SELECT 1 FROM users WHERE ( users.id = user_id ) ) ) -- the modified user_id exists in the users
    ) 
)
);
```

- `to authenticated` - this permissive policy is only granted to authenticated user
- `using` - further refine the permisive policy of what kind of authenticated user (if return `true`, then they can access to this table)
- `auth.uid()` refers to the uid in the JWT tokens sent by the current client
    * it must always be used in a `select` statement - i.e. `(SELECT auth.uid() as uid)`
- `with check` used to check the newly inserted or udpdated row whether it violates any conditions

6) A `daterange` column

- By default, supabase UI cannot add `daterange` directly.
- Therefore, this needs to be written manually.
```sql
ALTER TABLE public.orders
ADD COLUMN date_range daterange;
```

- By default, the daterange column in supabase is also in the following format:
`[start_date, end_date)` 
    - `[` or `]` means inclusive
    - `(` or `)` means exclusive

- A benefit of using daterange column is that overlapping can be easily checked:

```sql
-- Enable the btree_gist index required for the constraint.
create extension btree_gist;

-- Add a constraint to prevent overlaps with the same paddle_id
ALTER TABLE orders 
ADD CONSTRAINT exclude_duration
exclude using gist (paddle_id WITH =, date_range WITH &&);
```

- It can also be easily used to enforce constraint of certain duration

```sql
ALTER TABLE orders
  ADD CONSTRAINT max_7_days
  CHECK (upper(date_range) - lower(date_range) <= 7);
```

- It can also be used to enforce one day gap between reservations
```sql
-- First, make sure you have btree_gist extension
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add constraint to enforce 1-day gap between reservations for same user
ALTER TABLE orders
  ADD CONSTRAINT enforce_1_day_gap_between_order
  EXCLUDE USING gist (
    buyer_id WITH =,
    paddle_id WITH =,
    daterange(lower(date_range), upper(date_range) + 1) WITH &&
  );
```

7) Limit changes to only to certain columns
```sql
CREATE OR REPLACE FUNCTION restrict_update_orders()
RETURNS TRIGGER 
security definer
set search_path = ''
AS $$
BEGIN
  -- Only allow is_read to change
  IF (NEW.id IS DISTINCT FROM OLD.id OR
      NEW.created_at IS DISTINCT FROM OLD.created_at OR
      NEW.buyer_id IS DISTINCT FROM OLD.buyer_id OR
      NEW.seller_id IS DISTINCT FROM OLD.seller_id OR
      NEW.paddle_id IS DISTINCT FROM OLD.paddle_id OR
      NEW.date_range IS DISTINCT FROM OLD.date_range OR
      NEW.values IS DISTINCT FROM OLD.values
      ) THEN
    RAISE EXCEPTION 'This column cannot be changed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enforce_orders_update_restrictions
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION restrict_update_orders();
```

8) Subscribing to Database Changes using Broadcast
Key reference: https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
```javascript
// Effect - subscribe to the database
useEffect(() => {

    async function subscribeToMessages() {
        await supabase.realtime.setAuth()

        channel.current = supabase
            .channel(
                `topic:${orderId}`,
                {
                    config: { private: true }
                }
            )
            .on(
                'broadcast',
                { event: '*' },
                (payload) => fetchChatData()
            )
            .subscribe((status) => {
                console.log(`[ChatRoom] Status of Channel ${orderId}: `, status)
            })
    }

    subscribeToMessages()


    return () => {

        if (channel.current) {
            channel.current.unsubscribe()
            channel.current = null
        }
    }

}, [orderId])
```

- Ensure realtime is enabled on supabase from the table to be subscribed to
- Note that: `config: { private: true }` is particularly important.
- `channel.current` is from `useRef()`
- Make sure to properly clean up using `channel.current.unsubscribe()` when the component is unmounted.


