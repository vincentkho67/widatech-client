import Container from "@/app/container";

const Footer = () => {
  return (
    <footer className="flex items-center justify-center">
      <Container>
        <div className="flex flex-col items-center justify-center md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © 2024 WidaTech. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;