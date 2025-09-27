import React,{useState,useEffect, use} from "react";
import { useParams } from "react-router-dom";
import axios from "../../src/utils/axiosInstance";

const Subscriber = () => {
    const {subscriber,setSubscriber} = useState();
    const {subscriberVideo,setSubscriberVideo} = useState();
    useEffect(() => {
        const fetchSubscriber = async () => {
            try {
                const res = await axios.get(`functionality/subscriptions`);
                setSubscriber(res.data.data);
            } catch (err) {
                console.error("Error fetching subscriber:", err);
            }
        };

        const fetchSubscriberVideo = async () => {
            try {
                const res = await axios.get(`functionality/subscribedVideos`);
                setSubscriberVideo(res.data.data);
            } catch (err) {
                console.error("Error fetching subscriber videos:", err);
            }
        };

        fetchSubscriber();
        fetchSubscriberVideo();
    },[]);
    return(
        <div className="subscriber-container">
            <h1>Subscribers</h1>
            <div className="subscriber-list">
                {subscriber && subscriber.map((sub, index) => (
                    <div key={index} className="subscriber-item">
                        <img src={sub.channel.avatar} alt={sub.channel.fullName} />
                        <p>{sub.channel.fullName}</p>
                    </div>
                ))}
            </div>
            <h2>Subscribed Videos</h2>
            <div className="subscriber-video-list">
                {subscriberVideo && subscriberVideo.map((video, index) => (
                    <div key={index} className="subscriber-video-item">
                        <img src={video.thumbnail} alt={video.title} />
                        <p>{video.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )

}