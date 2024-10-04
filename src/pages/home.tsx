import React from "react";
import { Button, Layout, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Carousel } from "antd";
import "./styles/home.css";
import "./styles/common.css";

const { Content, Footer } = Layout;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout className="landing-page">
      {/* Header Section */}
      <div className="header">
        <div className="logo">
          <img
            src={require("../assets/logo.png")}
            alt="logo"
            className="logo-image"
          />
          <h3>XMUM Dance Club</h3>
        </div>
      </div>

      {/* Main Content */}
      <Content>
        {/* Buy Ticket Section */}
        <section>
          <Row justify="center">
            <Col>
              <div className="image-container">
                <img
                  src={require("../assets/landing_pic.png")}
                  alt="Background"
                  className="landing-img"
                />
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
                    <span>Buy Ticket</span>
                  </Button>
                </motion.div>
              </div>
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
            <div className="partners-container">
              <div className="partner">
                <img
                  src={require("../assets/xmum_dance_club.png")}
                  alt="XMUM Dance Club"
                  className="partner-logo"
                />
                <p className="jura">XMUM Dance Club</p>
              </div>

              <img
                src={require("../assets/x.png")}
                alt="XMUM Dance Club"
                className="cross"
              />

              <div className="partner">
                <img
                  src={require("../assets/bloom_in_motion.png")}
                  alt="Bloom In Motion"
                  className="partner-logo"
                />
                <p className="jura">Bloom In Motion</p>
              </div>
            </div>
            <div className="carousel-container">
              <Carousel autoplay arrows>
                {/* Slide 1 */}
                <div className="carousel-slide">
                  <img
                    src={require("../assets/img1.png")}
                    alt="Dance Club Slide 1"
                    className="carousel-image"
                  />
                  <div className="carousel-text">
                    <p>
                      Founded in 2016, XMUM Dance Club provide a vibrant
                      platform for students to express themselves through the
                      art of dance. Our club embraces a wide range of dance
                      styles, including all street style, k-pop, traditional
                      dance and so on, making our club a vibrant and diverse
                      community.
                    </p>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="carousel-slide">
                  <img
                    src={require("../assets/img2.png")}
                    alt="Dance Club Slide 2"
                    className="carousel-image"
                  />
                  <div className="carousel-text">
                    <p>
                      On November 22, 2024, we proudly present our highly
                      anticipated dance concert, “Bloom in Motion: Embrace Your
                      True Self.” This special event will feature a mix of
                      exciting dance performances, all tied together by a
                      heartfelt story. The centerpiece of the concert is a
                      dramatic narrative that follows the inspiring story of a
                      protagonist who discovers a deep love for dance.
                    </p>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="carousel-slide">
                  <img
                    src={require("../assets/img3.png")}
                    alt="Dance Club Slide 3"
                    className="carousel-image"
                  />
                  <div className="carousel-text">
                    <p>
                      Throughout the performance, the main character battles
                      challenges and criticism, but through resilience, he find
                      him inner strength, bloom, and reveal his true self on
                      stage.
                    </p>
                  </div>
                </div>

                {/* Slide 4 */}
                <div className="carousel-slide">
                  <img
                    src={require("../assets/img4.png")}
                    alt="Dance Club Slide 4"
                    className="carousel-image"
                  />
                  <div className="carousel-text">
                    <p>
                      Join us for an unforgettable night where dance becomes the
                      language of self-expression and transformation!
                    </p>
                  </div>
                </div>
              </Carousel>
            </div>
          </motion.div>
        </section>

        {/* Event Info Section */}
        {/* <section className="event-section">
          <motion.div
            className="event-info"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Bloom in Motion: Embrace Your True Self</h2>
            <p>
              Join us for an unforgettable night where dance becomes the
              language of self-expression and transformation!
            </p>
          </motion.div>
        </section> */}

        {/* Ticket Pricing Section */}
        <section className="past-events-section">
          <motion.div
            className="event-info"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Ticketing & Pricing</h2>
            <Row justify="center" className="image-row">
              <Col>
                <img
                  style={{ width: "60%" }}
                  src={require("../assets/1-3.jpg")}
                  alt="Ticket price"
                />
              </Col>
              <Col>
                <img
                  style={{ width: "60%" }}
                  src={require("../assets/2-3.png")}
                  alt="Ticket price"
                />
              </Col>
            </Row>
          </motion.div>
        </section>

        {/* Seat Layout Section */}
        <section className="past-events-section">
          <motion.div
            className="event-info"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Seating Layout</h2>
            <img
              style={{ width: "60%" }}
              src={require("../assets/0-3.jpg")}
              alt="Seat Layout"
            />
          </motion.div>
        </section>

        {/* Past Events Section */}
        <section className="past-events-section">
          <motion.div
            className="event-info"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Past Events</h2>
            <a
              href="https://youtu.be/HPuA0AjWb6A"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{ width: "100%" }}
                src={require("../assets/past_event.png")}
                alt="Past Event"
              />
            </a>
          </motion.div>
        </section>
      </Content>

      {/* Footer Section */}
      <Footer className="footer">
        <Row justify="center" className="footer-row">
          <Col>
            <p className="contact-us jura">
              Need Help?
              <br />
              Contact Us!
            </p>
            <div className="social-icons">
              <a
                href="https://www.instagram.com/xmumdc_concert"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={require("../assets/ig_icon.png")} alt="Instagram" />
              </a>
              <a
                href="https://wa.me/135333198"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={require("../assets/wa_icon.png")} alt="WhatsApp" />
              </a>
              <div className="jura" style={{ marginTop: "30px" }}>
                @xmumdc_concert
              </div>
            </div>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default Home;
