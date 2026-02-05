export default function handleImgError(event) {
    event.target.onerror = null
    event.target.src = "/images/not-available.png"
}