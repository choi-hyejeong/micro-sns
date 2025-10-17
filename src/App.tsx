import React from "react";
import { FeedPage } from "./pages/FeedPage";
import "./styles/global.css"; // 전역 스타일

function App() {
    return (
        <div>
            <div className="container">
                <FeedPage />
            </div>
        </div>
    );
}

export default App;
