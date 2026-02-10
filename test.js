// Payload
{
    "event": "INSERT",
        "meta": {
        "id": "1b9ff483-aadf-4229-8569-eff8a4e0fcd6"
    },
    "payload": {
        "id": "1b9ff483-aadf-4229-8569-eff8a4e0fcd6",
            "table": "messages",
                "record": {
            "id": "97e1560e-aad7-4032-abcb-b754573f0624",
                "is_read": false,
                    "message": "Not gonna make it today. Sorry!",
                        "order_id": "997718a8-32fe-4bcb-b2b5-99271c90426d",
                            "sender_id": "0a52582a-ef93-4d05-a524-12c1f7ead6f3",
                                "created_at": "2026-02-10T06:36:09.088282+00:00",
                                    "receiver_id": "3098b7c2-1d65-439b-acf3-bf6c11a6c961"
        },
        "schema": "public",
            "operation": "INSERT",
                "old_record": null
    },
    "type": "broadcast"
}

// Function
// async function sendMessage() {
//     const { error } = await supabase
//         .from('messages')
//         .insert({
//             order_id: '997718a8-32fe-4bcb-b2b5-99271c90426d',
//             sender_id: '0a52582a-ef93-4d05-a524-12c1f7ead6f3',
//             receiver_id: '3098b7c2-1d65-439b-acf3-bf6c11a6c961',
//             is_read: false,
//             message: 'Not gonna make it today. Sorry!'
//         })
//     console.log('Error: ', error)
// }