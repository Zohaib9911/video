import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useEffect } from "react";
import { api } from "./serverApi";
import { useState } from "react";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { MeetingContainer } from "./meeting/MeetingContainer";
import { LeaveScreen } from "./components/screens/LeaveScreen";
import { JoiningScreen } from "./components/screens/JoiningScreen";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import UserMenu from "./components/UserMenu";

function App() {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [customAudioStream, setCustomAudioStream] = useState(null);
  const [customVideoStream, setCustomVideoStream] = useState(null);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [user, setUser] = useState(null);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;
  // Set micOn and webcamOn to false by default on initial load
  useEffect(() => {
    setMicOn(false);
    setWebcamOn(false);
  }, []);

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  useEffect(() => {
    // Try to restore session from cookie
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlRoomId = params.get("roomId");
        const u = await api.me().catch(() => null);
        if (u?.email || u?.name) {
          setUser(u);
          setParticipantName(u?.name || u?.email?.split("@")[0] || "IMSUser");
          setIsAuthenticated(true);
        }
        if (urlRoomId) {
          // If invite link has roomId, skip auth and go to join screen with that id
          setMeetingId(urlRoomId);
        }
      } catch (e) {
        // not signed in; ignore
      }
    })();
  }, []);

  return (
    <>
      <MeetingAppProvider>
        {isAuthenticated ? (
          <UserMenu
            displayName={participantName || "User"}
            onSignOut={async () => {
              try {
                await api.signout();
              } catch (e) {}
              setToken("");
              setMeetingId("");
              setParticipantName("");
              setWebcamOn(false);
              setMicOn(false);
              setMeetingStarted(false);
              setIsAuthenticated(false);
              setUser(null);
            }}
          />
        ) : null}
        {!isAuthenticated ? (
          authMode === "signin" ? (
            <SignIn
              onSwitchToSignUp={() => setAuthMode("signup")}
              onSignedIn={(u) => {
                setUser(u);
                setParticipantName(
                  u?.name || u?.email?.split("@")[0] || "IMSUser"
                );
                setIsAuthenticated(true);
              }}
            />
          ) : (
            <SignUp
              onSwitchToSignIn={() => setAuthMode("signin")}
              onSignedUp={(u) => {
                setUser(u);
                setParticipantName(
                  u?.name || u?.email?.split("@")[0] || "IMSUser"
                );
                setIsAuthenticated(true);
              }}
            />
          )
        ) : isMeetingStarted ? (
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: micOn,
              webcamEnabled: webcamOn,
              name: participantName ? participantName : "IMSUser",
              multiStream: true,
              customCameraVideoTrack: customVideoStream,
              customMicrophoneAudioTrack: customAudioStream,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={() => {
                setToken("");
                setMeetingId("");
                setWebcamOn(false);
                setMicOn(false);
                setMeetingStarted(false);
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.delete("roomId");
                  window.history.replaceState(
                    {},
                    "",
                    url.origin + url.pathname
                  );
                } catch (e) {}
              }}
              allowRecording={Boolean(user?.admin || user?.isadmin)}
              isAdmin={Boolean(user?.admin || user?.isadmin)}
              setIsMeetingLeft={setIsMeetingLeft}
            />
          </MeetingProvider>
        ) : isMeetingLeft ? (
          <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
        ) : (
          <JoiningScreen
            participantName={participantName}
            setParticipantName={setParticipantName}
            setMeetingId={setMeetingId}
            setToken={setToken}
            initialMeetingId={meetingId}
            micOn={micOn}
            setMicOn={setMicOn}
            webcamOn={webcamOn}
            setWebcamOn={setWebcamOn}
            customAudioStream={customAudioStream}
            setCustomAudioStream={setCustomAudioStream}
            customVideoStream={customVideoStream}
            setCustomVideoStream={setCustomVideoStream}
            onClickStartMeeting={() => {
              setMeetingStarted(true);
            }}
            startMeeting={isMeetingStarted}
            setIsMeetingLeft={setIsMeetingLeft}
            isAdmin={Boolean(user?.admin || user?.isadmin)}
          />
        )}
      </MeetingAppProvider>
    </>
  );
}

export default App;
