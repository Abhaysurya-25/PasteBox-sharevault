import DownloadPage from "./DownloadPage";
import Header from "./HeaderComp";
import Footer from "./Footer";

const Download = () => (
  <div className="page-shell flex flex-col">
    <Header />
    <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      <DownloadPage />
    </main>
    <Footer />
  </div>
);

export default Download;
