
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router';
import Loading from '../Utils/Loading';

export default function ProtectedRoute({children, redirectWithSession=false, redirectPath}){

    const {session} = useAuth()

    if(session === undefined){
        return <Loading />
    }

    if(redirectWithSession){
        return session ? <Navigate to={redirectPath}/> : children
    } else {
        return session ? children : <Navigate to={redirectPath} />
    }
    
}