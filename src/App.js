import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AudioRecorder from "./AudioRecorder";
import VideoRecorder from "./VideoRecorder";

function App() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState();
  let [recordOption, setRecordOption] = useState("video");
  let [audio, setAudio] = useState(null);

  const toggleRecordOption = (type) => {
    return () => {
      setRecordOption(type);
    };
  };

  const setAudioData = e => {
    setAudio(e);
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("file", audio, "audio.mp3");

      const res = await fetch("http://localhost:4000/whisper", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + process.env.REACT_APP_OPENAI_KEY,
        },
        body: formData
      });
      const dat = await res.json();
      setData(JSON.stringify(dat));
    } catch (err) {
      console.log(err);
      setData("");
    }
  };

  return (
    <div className="App">
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" {...register("file")} /><br />
        <input type="submit" /><br />
        <textarea value={data} cols={100} rows={20} />
      </form> */}
      <div>
        <h1>React Media Recorder</h1>
        <div className="button-flex">
          {/* <input type="file" {...register("file")} /><br /> or */}
          <button onClick={toggleRecordOption("video")}>Record Video</button>
          <button onClick={toggleRecordOption("audio")}>Record Audio</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder setAudio={setAudioData} />}
          <input type="submit" /><br />
          <textarea value={data} cols={100} rows={20} />
        </form>
      </div>
    </div>
  );
}

export default App;