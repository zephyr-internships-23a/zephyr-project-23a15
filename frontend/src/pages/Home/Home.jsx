import Banner from "@/components/Banner/Banner";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <section className="container space-y-5">
      <Navbar />
      <div className=""> 
        <Banner />
      </div>
    </section>
  );
}
