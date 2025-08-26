import {
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
} from "@videosdk.live/react-sdk";

const useMediaStream = () => {
  // By default, do not request or create any media tracks (camera/mic off).
  // Only create tracks when explicitly requested by the user.

  // getVideoTrack and getAudioTrack will only be called when user wants to turn ON camera/mic

  const getVideoTrack = async ({ webcamId, encoderConfig }) => {
    // Only create video track when this function is called (i.e., when user enables camera)
    try {
      const track = await createCameraVideoTrack({
        cameraId: webcamId,
        encoderConfig: encoderConfig ? encoderConfig : "h540p_w960p",
        optimizationMode: "motion",
        multiStream: false,
      });
      return track;
    } catch (error) {
      return null;
    }
  };

  const getAudioTrack = async ({ micId }) => {
    // Only create audio track when this function is called (i.e., when user enables mic)
    try {
      const track = await createMicrophoneAudioTrack({
        microphoneId: micId,
      });
      return track;
    } catch (error) {
      return null;
    }
  };

  // Do not create or request any tracks by default.
  // Only expose functions to create tracks on demand.
  return { getVideoTrack, getAudioTrack };
};

export default useMediaStream;
