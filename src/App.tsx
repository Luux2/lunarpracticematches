import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import IndexScreen from "./pages/IndexScreen.tsx";
import RoundsScreen from "./pages/RoundsScreen.tsx";
import MatchDetailsScreen from "./pages/MatchDetailsScreen.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<IndexScreen/>}/>
                <Route path="/rounds" element={<RoundsScreen/>}/>
                <Route path="/rounds/:roundId/matches/:matchId" element={<MatchDetailsScreen />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
