import Container from "@/app/container";

const Footer = () => {
  return (
    <footer>
      <Container>
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800">WidaTech</h2>
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
