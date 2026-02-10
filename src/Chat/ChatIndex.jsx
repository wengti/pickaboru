import { useCurrentUser } from '../Auth/CurrentUserProvider'

export default function ChatIndex() {

    const {currentUser} = useCurrentUser()
    const style = {
        opacity: 0.5,
        margin: 'auto auto',
        padding: '0 1em',
        textAlign: 'center',
        fontSize: '1.5rem'
    }

    return (
        <h1 style={style}>Welcome to your chat rooms, {currentUser.name}!</h1>
    )
}