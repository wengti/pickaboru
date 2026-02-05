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