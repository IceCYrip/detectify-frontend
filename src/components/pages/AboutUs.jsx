import React, { useEffect } from "react";
// import Navbar from "./components/Navbar";
import "../../css/AboutUs.css";

const AboutUs = () => {
  useEffect(() => {
    localStorage.setItem("activeMenu", "About Us");
  }, []);

  const memberDetails = [
    {
      id: 1,
      fullName: "Kshitija Karande",
      src: "/Kshitija.jpeg",
      alt: `Kshitija's Photo`,
    },
    {
      id: 2,
      fullName: "Utkarsha Shelar",
      src: "/Utkarsha.jpeg",
      alt: `Utkarsha's Photo`,
    },
    {
      id: 3,
      fullName: "Yashasvii Sawal",
      src: "/Yashasvii.jpeg",
      alt: `Yashasvii's Photo`,
    },
  ];
  return (
    <>
      {/* <Navbar /> */}
      <div className="aboutUsWrapper">
        <div className="aboutUsBody">
          <h1>About Us</h1>
          <p>
            Detectify is your one stop solution to verify the authenticity of
            all your luxury goods in one place. All you need to do is scan the
            QR available on the product and you will get all the product details
            of your purchase on your screen in a second.
          </p>
          <h2>Our Members</h2>
          <div className="members">
            {memberDetails?.map((person) => (
              <div className="memberContainer" key={person.id}>
                <img
                  className="memberPhotos"
                  src={`${person?.src}`}
                  alt={`${person?.alt}`}
                />
                <span>{person?.fullName}</span>
              </div>
            ))}
            {/* <div className="memberContainer">
              <img
                className="memberPhotos"
                src="/Kshitija.jpeg"
                alt="Kshitija's Photo"
              />
              <span>Kshitija Karande</span>
            </div>
            <div className="memberContainer">
              <img
                className="memberPhotos"
                src="/Utkarsha.jpeg"
                alt="Utkarsha's Photo"
              />
              <span>Utkarsha idkHerLastName</span>
            </div>
            <div className="memberContainer">
              <img
                className="memberPhotos"
                src="/Yashasvee.jpeg"
                alt="Yashasvee's Photo"
              />
              <span>Yashasvee idkHerLastName</span>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
