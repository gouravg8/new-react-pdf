import "./App.css";
import Scrollable from "./Components/Scrollable";

function App() {
  return (
    <>
      <Scrollable
        url="https://podetaiilsbucket.s3.ap-southeast-2.amazonaws.com/DURATRAY/Design/15340..pdf?X-Amz-Expires=600000&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA36NRVXOJZ2OHO3VX%2F20250401%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250401T060833Z&X-Amz-SignedHeaders=host&X-Amz-Signature=03ea18268ff64e5609379cb294c5f22e61441ea87a6ef91f2b2dec18fdf62cf0"
        scale={0.5}
      />
    </>
  );
}

export default App;
