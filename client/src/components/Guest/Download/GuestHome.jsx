import Header from "../../HeaderComp";
import GuestDownload from "./GuestDownload";
import Footer from "../../Footer";

const GuestHome = () => (
  <div className="page-shell flex flex-col">
    <Header />
    <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      <GuestDownload />
    </main>
    <Footer />
  </div>
);

export default GuestHome;
