
import { useCurrentUser } from './CurrentUserProvider';
import { Navigate } from 'react-router';

export default function AdminProtectedRoute({children}){

    // useCurrentUser
    const { currentUser } = useCurrentUser()
    
    return (
        currentUser?.role === 'admin' ?
        children :
        <Navigate to='/signin'/>
    )
}