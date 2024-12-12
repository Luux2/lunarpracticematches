import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import CreateMatchesScreen from "./pages/CreateMatchesScreen.tsx";
import RoundsScreen from "./pages/RoundsScreen.tsx";
import MatchDetailsScreen from "./pages/MatchDetailsScreen.tsx";
import IndexScreen from "./pages/IndexScreen.tsx";
import PracticeTeamsScreen from "./pages/PracticeTeamsScreen.tsx";
import ViewPracticeTeamsScreen from "./pages/ViewPracticeTeamsScreen.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<IndexScreen/>}/>
                <Route path="/create-matches" element={<CreateMatchesScreen/>}/>
                <Route path="/rounds" element={<RoundsScreen/>}/>
                <Route path="/rounds/:roundId/matches/:matchId" element={<MatchDetailsScreen />} />
                <Route path="/practice-teams" element={<PracticeTeamsScreen/>}/>
                <Route path="/view-practice-teams" element={<ViewPracticeTeamsScreen/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
