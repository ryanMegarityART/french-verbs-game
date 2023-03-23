export interface stopRecordingTypes {
    Mp3Recorder: any;
    setBlob: any;
    setIsRecording: any;
}

const blobToBase64 = (blob: any) => {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
};

export const stopRecording = ({
    Mp3Recorder,
    setBlob,
    setIsRecording,
}: stopRecordingTypes) => {
    Mp3Recorder.stop()
        .getMp3()
        .then(async ([buffer, blob]: any) => {
            // const blobURL = URL.createObjectURL(new Blob(blob))
            // const file = new File(buffer, 'me-at-thevoice.mp3', {
            //     type: blob.type,
            //     lastModified: Date.now()
            // });
            // setBlob(file)
            setIsRecording(false);
            const base64String = await blobToBase64(blob);
            // console.log(base64String);
            setBlob(base64String);
        })
        .catch((e: any) => console.log(e));
};
