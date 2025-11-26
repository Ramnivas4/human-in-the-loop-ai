"use client"

import { useEffect, useState } from "react"
import { LiveKitRoom, RoomAudioRenderer, ControlBar, DisconnectButton } from "@livekit/components-react"
import "@livekit/components-styles"
import { useParams, useRouter } from "next/navigation"
import { Loader2, PhoneOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SupervisorCallPage() {
    const params = useParams()
    const router = useRouter()
    const roomId = params.roomId as string
    const [token, setToken] = useState("")

    useEffect(() => {
        if (!roomId) return

        const name = "Supervisor";

        (async () => {
            try {
                const resp = await fetch(`/api/livekit-token?roomName=${roomId}&participantName=${name}`)
                const data = await resp.json()
                setToken(data.token)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [roomId])

    if (token === "") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 h-screen flex flex-col">
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Supervisor Call - Room: {roomId}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center bg-slate-950 rounded-md m-4 relative">
                    <LiveKitRoom
                        video={false}
                        audio={true}
                        token={token}
                        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                        data-lk-theme="default"
                        style={{ height: '100%', width: '100%' }}
                        onDisconnected={() => router.push('/supervisor')}
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
                            <div className="text-2xl font-semibold">Connected to Customer</div>
                            <p className="text-slate-400">You are now live. Speak to assist the customer.</p>

                            <RoomAudioRenderer />
                            <ControlBar controls={{ camera: false, screenShare: false, chat: false }} />

                            <div className="mt-8">
                                <DisconnectButton>
                                    <Button variant="destructive" size="lg" className="gap-2">
                                        <PhoneOff className="h-5 w-5" />
                                        End Call
                                    </Button>
                                </DisconnectButton>
                            </div>
                        </div>
                    </LiveKitRoom>
                </CardContent>
            </Card>
        </div>
    )
}
