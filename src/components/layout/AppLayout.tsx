import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
