import React from "react";

import styles from "./videoShow.module.scss";

import axios from "../../../axios";

const VideoShow = (props) => {
  const [video, setVideo] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [contentType, setContentType] = React.useState("");

  React.useEffect(() => {
    getVideoSource();
  }, []);

  const getVideoSource = async () => {
    const query = new URLSearchParams(window.location.search);
    const play_data = query.get("play_data");
    if (play_data) {
      const decoded_play_data = JSON.parse(atob(play_data));
      console.log("decoded_play_data= ", decoded_play_data);
      axios.get(`/lom/playlist/${decoded_play_data.id}`).then((res) => {
        setContentType(res.data.playList[0].contentType);
        if (res.data.type === "mo") {
          changeVideoSource(
            res.data.playList[0]._id,
            res.data.playList[0].language
          );
        }
      });
    }
  };

  const changeVideoSource = (id, language = "en") => {
    if (id) {
      console.log("id= ", id);
      console.log("language= ", language);

      axios.get(`/player/getPlayedLo/${id}/${language}/0`).then((response) => {
        setVideo(response.data.loSignedUrl);
        setLoading(false);
      });
    }
  };

  const composeTitle = () => {
    const { mainTitle, subTitle, topicTitle } = props;
    let title = mainTitle;
    if (subTitle) {
      title = title + " > " + subTitle;
    }
    if (topicTitle) {
      title = title + " > " + topicTitle;
    }
    return title;
  };

  const renderVideoAndAudio = () => {
    console.log(contentType);
    if (contentType === "video/mp4") {
      return (
        <>
          <video controls width={"80%"} height={"auto"}>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      );
    } else if (contentType === "audio/mpeg") {
      return (
        <div
          style={{
            width: "50%",
            height: "2rem",
          }}
        >
          <audio
            controls
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <source src={video} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    } else if (contentType === "application/pdf") {
      console.log(video);
      return (
        <embed
          style={{
            width: "100%",
            height: "100%",
          }}
          src={video}
          type="application/pdf"
        ></embed>
      );
    } else if (
      contentType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return (
        <iframe
          // src="https://onedrive.live.com/embed?resid=3B0F96FBE86F9499%21212&amp;authkey=!ALGmKCQf83WK2fk&amp;em=2&amp;wdAr=1.7777777777777777"
          src="https://onedrive.live.com/embed?resid=3B0F96FBE86F9499%21212&amp;authkey=!ALGmKCQf83WK2fk&amp;em=2&amp;wdAr=1.7777777777777777"
          width="100%"
          height="100%"
          frameborder="0"
        >
          This is an embedded{" "}
          <a target="_blank" href="https://office.com">
            Microsoft Office
          </a>{" "}
          presentation, powered by{" "}
          <a target="_blank" href="https://office.com/webapps">
            Office
          </a>
          .
        </iframe>
      );
    }
  };

  return (
    <div className={styles.videoShow}>
      <div>{loading ? <p>Loading...</p> : renderVideoAndAudio()}</div>
    </div>
  );
};

export default VideoShow;
