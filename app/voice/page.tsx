'use client';

import { useState } from 'react';
import { VoiceCall } from '@/components/voice-call';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowLeft, Mic, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';

export default function VoicePage() {
    const [isCallActive, setIsCallActive] = useState(false);

    const handleStartCall = () => {
        setIsCallActive(true);
    };

    const handleEndCall = () => {
        setIsCallActive(false);
    };

    if (isCallActive) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-4">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <VoiceCall onDisconnect={handleEndCall} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">TechFlow Support Voice Assistant</h1>
                    <p className="text-xl text-muted-foreground">
                        Describe your technical issue and get instant troubleshooting steps
                    </p>
                </div>

                <Card className="border-2">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Ready to Start?</CardTitle>
                        <CardDescription>
                            Click the button below to begin your voice call
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            <Button
                                onClick={handleStartCall}
                                size="lg"
                                className="gap-2 text-lg px-8 py-6 rounded-full"
                            >
                                <Phone className="w-6 h-6" />
                                Start Voice Call
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 pt-6">
                            <Card>
                                <CardHeader>
                                    <Mic className="w-8 h-8 mb-2 text-primary" />
                                    <CardTitle className="text-lg">Describe the Issue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Explain what's wrong with your device or service in plain English
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <MessageSquare className="w-8 h-8 mb-2 text-primary" />
                                    <CardTitle className="text-lg">Instant Solutions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Get step-by-step troubleshooting instructions immediately
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Clock className="w-8 h-8 mb-2 text-primary" />
                                    <CardTitle className="text-lg">Live Expert Handoff</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Complex issues are instantly transferred to a human specialist
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <p className="font-medium">Before you start:</p>
                            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                                <li>Make sure your microphone is connected and working</li>
                                <li>Grant microphone permissions when prompted</li>
                                <li>Find a quiet place for the best experience</li>
                                <li>Speak clearly and wait for the AI to finish responding</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
