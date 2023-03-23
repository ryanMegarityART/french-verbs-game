import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { formatTime } from "../../helpers/formatTime";
import { startRecording } from "../../helpers/startRecording";
import { stopRecording } from "../../helpers/stopRecording";
// import "./assets/styles/main.scss";
import MicRecorder from "mic-recorder-to-mp3";
import { Button } from "react-bootstrap";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

interface AudioRecordProps {
  blob: string;
  setBlob: Dispatch<SetStateAction<string>>;
}

const AudioRecord: FC<AudioRecordProps> = ({ blob, setBlob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording) {
        setTimer((seconds) => seconds + 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
      setTimer(0);
    };
  }, [isRecording]);

  useEffect(() => {
    let newVariable: any;
    newVariable = navigator;

    newVariable.getUserMedia(
      { audio: true },
      () => {
        // console.log("Permission Granted");
        setIsBlocked(false);
      },
      () => {
        console.log("Permission Denied");
        setIsBlocked(true);
      }
    );
  }, []);

  return (
    <div className="container">
      <div className="main-component">
        <Button
          className="m-1"
          onClick={(e) =>
            startRecording({ Mp3Recorder, isBlocked, setBlob, setIsRecording })
          }
          disabled={isRecording}
          variant="primary"
        >
          Record
        </Button>
        <Button
          className="m-1"
          variant="danger"
          onClick={(e) =>
            stopRecording({ Mp3Recorder, setBlob, setIsRecording })
          }
        >
          stop
        </Button>
        <div>
          {blob ? (
            <audio src={blob} controls />
          ) : (
            <p className="timer">{formatTime({ timer })}</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default AudioRecord;
