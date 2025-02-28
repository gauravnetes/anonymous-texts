"use client";

import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/User.model";
import { acceptsMessageSchema } from "@/schemas/acceptsMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard"

function page() {
  // get the messages
  const [messages, setMessages] = useState<Message[]>([]);
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  // when accept messages is off
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  // optimistic ui: supoose you like a post on FB. The UI get updated instantly as liked and don't wait for the backend requests, api hit, database updates etc. It instantly changes to give the user the best user experience. Later if in the backend the request gets failed then it's updated back to normal again

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  // form for accept messages toggle
  const form = useForm({
    resolver: zodResolver(acceptsMessageSchema),
  });
  // fields inside form: register, handleSubmit, watch, formState: {errors}
  const { register, watch, setValue } = form;

  // inject the watch:
  const acceptMessages = watch("acceptsMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptsMessage", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Messages Refreshed",
            description: "Showing Latest Messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // fire a useEffect hook
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptsMessage", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to switch toggle",
        variant: "destructive",
      });
    }
  };

  const {username} = session?.user as User
  // TODO: Research about it

  const baseURL = `${window.location.protocol}//${window.location.host}`
  const profileURL = `${baseURL}/u/${username}`// final url of the user's dashboard which we can makke as a functionality in the user dashboard to let the user copy the URL link    
  
  // copy ot clipboard; 
  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileURL)
    toast({
      title: "URL copied successfully!",
      description: "Profile URL has been copied to clipboard"
    })
  }
  
  if (!session || !session.user) {
    return <div>
      Please Log In
    </div>
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4"> User Dashboard</h1>
      {/* Copy to ClipBoard functionality UI */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Unique Link</h2> {' '}
        <div className="flex items-center">
          <input 
          type="text"
          value={profileURL}
          disabled
          className="input input-bordered w-full p-2 mr-2" 
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>
      {/* Toggle functioanlity UI */}   
      <div className="mb-4">
        <Switch
        {...register('acceptsMessage')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button 
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault(); 
        fetchMessages(true); 
      }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
            key={message._id}
            message={message}
            onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No Messages Found to Display</p>
        )
      }
      </div>
    </div>
  )      
}

export default page;
