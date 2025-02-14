import LandingScreen from "./screens/LandingScreen";
//import DbTestScreen from "./screens/dbTestScreen"

export default function App() {
  console.log("in app");
  return <LandingScreen />;
  //return <DbTestScreen /> //has to begin with a uppercase letter for some reason or it doesn't work.
}
