import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './help.css';

const HelpSection = () => {
    return (
        <Container className="help-section">
            <h1 className="text-center mb-4">How Can We Help You?</h1>
            <Row>
                <Col md={4}>
                    <Card className="help-card">
                        <Card.Body>
                            <Card.Title>Order Issues</Card.Title>
                            <Card.Text>
                                If you have any questions about your order, delivery, or refunds, our support team is here to help!
                            </Card.Text>
                            <Button variant="primary" href="#order-issues">
                                Learn More
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="help-card">
                        <Card.Body>
                            <Card.Title>Product Information</Card.Title>
                            <Card.Text>
                                Have questions about a product? Find detailed information, specifications, and user reviews here.
                            </Card.Text>
                            <Button variant="primary" href="#product-info">
                                Learn More
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="help-card">
                        <Card.Body>
                            <Card.Title>Account & Settings</Card.Title>
                            <Card.Text>
                                Need help with your account settings, login issues, or profile management? We’ve got you covered!
                            </Card.Text>
                            <Button variant="primary" href="#account-settings">
                                Learn More
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <hr />
            <h2 id="order-issues">Order Issues</h2>
            <p>If you have any issues with your order, including delivery or refunds, you can contact us by emailing support@shopeasy.com. We’ll get back to you as soon as possible.</p>

            <h2 id="product-info">Product Information</h2>
            <p>Our product pages contain detailed specifications, images, and customer reviews. If you have a specific question, you can also reach out to our support team for more information.</p>

            <h2 id="account-settings">Account & Settings</h2>
            <p>If you’re experiencing trouble logging in or need help with account settings, go to your profile page to reset your password or update your information. For additional assistance, feel free to contact us.</p>
        </Container>
    );
}

export default HelpSection;
