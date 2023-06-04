import React from "react";
import happy_1 from "./pics/happy-people.png";
import happy_2 from "./pics/picture-happy.jpg";
import phone from "./pics/picture-phone.PNG";
import slide1 from "./pics/slide (1).png";
import slide2 from "./pics/slide (2).png";
import slide3 from "./pics/slide (3).png";
import "./home.css";

const Slideshow = ({ images, speed }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, speed);

    return () => clearInterval(interval);
  }, [images, speed]);

  return (
    <div className="slideshow-container">
      <img
        className="slide"
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
      />
    </div>
  );
};

function App() {
  const slideshowImages = [slide1, slide2, slide3];
  return (
    <body>
      <div className="content-container">
        <div className="page-container">
          <div className="intro">
            <div className="slide">
              <Slideshow images={slideshowImages} speed={100} />
            </div>
            <div className="intro-text">
              Discover new opportunities, share special moments, and join a
              lively community that embraces happiness, inspiration, and
              unforgettable experiences.
            </div>
          </div>
          <div className="row">
            <div className="column">
              <p className="title">Share Events</p>
              <img src={happy_1} alt="Happy people" />
              <p className="definition">
                Share your favorite events with the world! Invite others to
                thrilling concerts, inspiring workshops, and captivating
                exhibitions.
              </p>
            </div>
            <div className="column">
              <p className="title">Join Events</p>
              <img src={happy_2} alt="Happy person" />
              <p className="definition">
                You can participate in any event you like, under the conditions
                that you like.
              </p>
            </div>
            <div className="column">
              <p className="title">View Events</p>
              <img src={phone} alt="Phone" />
              <p className="definition">
                As an event organizer, easily track participants, make
                arrangements, and create unforgettable experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default App;
