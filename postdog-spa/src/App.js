import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexts
import { AppProvider } from "./context/AppContext";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import TermsPage from "./pages/Terms/TermsPage";
import PrivacyPage from "./pages/Terms/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutUsPage from "./pages/AboutUs/AboutUs";

// Styles
import "./App.css";
import "./assets/styles/styles.css";
import ContactPage from "./pages/Contact/ContactPage";

import PostDogLogoWhite from "./assets/Logos/logoHeaderRojo.png";


function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <MainLayout >
              <Home />
            </MainLayout>
          } />
          <Route path="/about-us" element={
            <MainLayout logoHeader={PostDogLogoWhite} >
              <AboutUsPage />
            </MainLayout>
          } />

          <Route path="/contact" element={
            <MainLayout logoHeader={PostDogLogoWhite} >
              <ContactPage />
            </MainLayout>
          } />
          
          <Route path="/terms-conditions" element={
            <MainLayout isStickyPropsHeader={true}>
              <TermsPage />
            </MainLayout>
          } />
          <Route path="/policy-privacy" element={
            <MainLayout isStickyPropsHeader={true}>
              <PrivacyPage />
            </MainLayout>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
