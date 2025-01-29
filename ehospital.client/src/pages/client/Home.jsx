import React from "react";
import Header from "../../components/client/Header";
import SpecialityMenu from "../../components/client/SpecialityMenu";
import TopDoctors from "../../components/client/TopDoctors";
import Banner from "../../components/client/Banner";
const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;
