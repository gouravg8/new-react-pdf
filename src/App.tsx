import "./App.css";
import Scrollable from "./Components/Scrollable";

function App() {
	return (
		<>
			<Scrollable
				url="https://podetaiilsbucket.s3.ap-southeast-2.amazonaws.com/DURATRAY/Production/15342..pdf?X-Amz-Expires=600000&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA36NRVXOJZ2OHO3VX%2F20250407%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250407T093931Z&X-Amz-SignedHeaders=host&X-Amz-Signature=05139e2e34686861fa8bc9475ec9d35ff271800f894d8a391e26bd7fd0910845"
				scale={0.5}
			/>
		</>
	);
}

export default App;
