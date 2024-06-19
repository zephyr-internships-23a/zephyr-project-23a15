import Navbar from "@/components/Navbar/Navbar";
import NotificationSound from '@/assets/notification.mp3'
import { Howl, } from 'howler';
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { useStoreContext } from "@/store/StoreProvider";
import { useSearchParams } from "react-router-dom";
import { SOCKET_EVENT } from "@/constants/socket";
var sound = new Howl({
    src: [NotificationSound],
    html5: true
});

export default function Chat() {
    const [chats, setChats] = useState([]);
    const { user, SocketClient } = useStoreContext();
    const [searchParams] = useSearchParams();
    const [selectedChatId, setSelectedChatId] = useState(searchParams.get('chatId'));
    const [disabled, setDisabled] = useState(true);
    const messageRef = useRef(null);
    const handleSend = async (e) => {
        e.preventDefault();
        try {
            if (e.target[0].value === '') return
            console.log(selectedChatId)
            SocketClient.emit(SOCKET_EVENT.NEW_MESSAGAE_SEND, {
                roomId: selectedChatId,
                user_id: user.id,
                message: e.target[0].value
            })
            e.target[0].value = ''
        } catch (error) {
            console.log(error);
        }
    }
    async function fetchChats() {
        try {
            const res = await AxiosInstance.get('/chat');
            if (res.status === 200) {
                setChats(res.data.chats)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function joinRoom() {
        console.log('join')
        SocketClient.emit(SOCKET_EVENT.JOIN_ROOM, { roomId: selectedChatId });
    }
    useEffect(() => {
        console.log('how may times here??')
        fetchChats();
    }, [])

    useEffect(() => {
        if (SocketClient) {
            setDisabled(true)
            setTimeout(() => {
                setDisabled(false)
                joinRoom();
            }, 2000)
            SocketClient.on(SOCKET_EVENT.NEW_MESSAGE_RECEIVE, (data) => {
                console.log('how many times!')
                fetchChats();
                if (data?.user_id !== user.id)
                    sound.play();
            })
        }
    }, [SocketClient])
    useEffect(() => {
        console.log(chats, 'changedd')
        if (chats && messageRef && selectedChatId) {
            messageRef.current.scrollIntoView(false);
        }
    }, [chats, messageRef, selectedChatId])
    return (
        <section className="container">
            <Navbar />
            <main className="grid grid-cols-3 mt-10">
                <div className="border h-[70vh] p-2 overflow-y-auto">
                    {
                        chats.map(chat => (
                            <div className="cursor-pointer" onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('chatId', chat?._id);
                                window.history.replaceState(null, null, url)
                                setSelectedChatId(chat?._id)

                            }} key={chat._id}>
                                {
                                    chat.user_one._id === user.id ?

                                        <div className={`border p-2 rounded-md flex gap-2 items-center ${chat?._id === selectedChatId ? 'bg-gray-200' : ''}`} key={chat._id}>
                                            <img src={chat?.user_two?.avatar} alt="" className="h-10 w-10 rounded-full" />
                                            <p className="text-slate-500 font-semibold">{chat?.user_two?.name}</p>
                                        </div>
                                        :
                                        <>
                                            {
                                                chat?.messages?.length > 0 &&
                                                <div className={`border p-2 rounded-md flex gap-2 items-center ${chat?._id === selectedChatId ? 'bg-gray-200' : ''}`} key={chat._id}>
                                                    <img src={chat?.user_one?.avatar} alt="" className="h-10 w-10 rounded-full" />
                                                    <p className="text-slate-500 font-semibold">{chat?.user_one?.name}</p>
                                                </div>
                                            }
                                        </>

                                }
                            </div>

                        ))
                    }
                </div>
                <div className="col-span-2 relative border h-[70vh]  ">
                    <div className="p-2 h-[65vh] overflow-y-auto">
                        <div ref={messageRef} className="space-y-2">
                            {
                                chats?.find(chat => chat._id == selectedChatId)?.messages?.map((chat, index) => (
                                    <div key={index} className={`flex ${user.id == chat?.user_id ? 'justify-end' : 'justify-start'} `}>
                                        <div className={`px-7 py-1 rounded-md ${user.id == chat?.user_id ? 'text-right bg-cyan-300' : 'text-left bg-gray-300'}`}>
                                            {chat?.message}
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <form onSubmit={handleSend} className="absolute bottom-0 flex items-center w-full h-[5vh] border-t ">
                        <input disabled={disabled} placeholder="Type a message..." className="w-full h-full outline-none px-2" />
                        <Button disabled={disabled}>Send</Button>
                    </form>
                </div>

            </main>
        </section >
    )
}
