  (
    -- make sure the user is adding for themselves
    (
      
      ( SELECT auth.uid() AS uid) = user_id
    ) 
    AND 
    -- make sure that this user exists
    (
        EXISTS 
        ( SELECT 1 FROM users 
        WHERE (auth.uid() = users.id)
        )
    )
)