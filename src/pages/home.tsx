import React, { useRef } from "react";
import { firestore } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button, Layout, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./styles/home.css";

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  const messageRef = useRef<HTMLInputElement>(null);
  const ref = collection(firestore, "messages");
  const navigate = useNavigate();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    if (!message) return;
    console.log(message);

    try {
      await addDoc(ref, { message });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    messageRef.current!.value = "";
  };

  return (
    <Layout className="landing-page">
      {/* Header Section */}
      <div className="header">
        <div className="logo">
          <img
            src={require("../assets/logo.png")} // Replace with actual logo path
            alt="logo"
            className="logo-image"
          />
          <h2>XMUM Dance Club</h2>
        </div>
      </div>

      {/* Main Content */}
      <Content>
        {/* Buy Ticket Section */}
        <section className="ticket-section">
          <img
            src={require("../assets/img1.png")}
            alt="Background"
            className="absolute-img"
          />
          <Row justify="center">
            <Col>
              <motion.div
                className="ticket-button"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  className="buy-ticket-button"
                  onClick={() => navigate("/seatselection")}
                >
                  Buy Ticket
                </Button>
              </motion.div>
            </Col>
          </Row>
        </section>

        {/* About Us Section */}
        <section className="about-section">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>ABOUT US</h2>
            <p>
              Founded in 2016, XMUM Dance Club provides a vibrant platform for
              students to express themselves through the art of dance. Our club
              embraces a wide range of dance styles, including all street style,
              K-pop, traditional dance, and more, making our club a vibrant and
              diverse community.
            </p>
          </motion.div>
        </section>

        {/* Event Info Section */}
        <section className="event-section">
          <motion.div
            className="event-info"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3>Bloom in Motion: Embrace Your True Self</h3>
            <p>
              Join us for an unforgettable night where dance becomes the
              language of self-expression and transformation!
            </p>
          </motion.div>
        </section>

        {/* Past Events Section */}
        <section className="past-events-section">
          <h2>Past Events</h2>
          {/* Insert past event images here */}
        </section>
      </Content>

      {/* Footer Section */}
      <Footer className="footer">
        <Row justify="center" className="footer-row">
          <Col>
            <p>Need Help? Contact Us!</p>
            <div className="social-icons">
              <a
                href="https://www.instagram.com/xmumdc_concert"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/path/to/instagram-icon.png" alt="Instagram" />
              </a>
              <a
                href="https://wa.me/123456789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/path/to/whatsapp-icon.png" alt="WhatsApp" />
              </a>
            </div>
          </Col>
        </Row>
      </Footer>
    </Layout>
    // <div>
    //   <h1>Home</h1>
    //   <form onSubmit={handleSave}>
    //     <label>Enter message:</label>
    //     <input type="text" ref={messageRef} />
    //     <button type="submit">Save</button>
    //   </form>
    // </div>
  );
};

export default Home;
