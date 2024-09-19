
import InvoiceForm from "@/components/Invoices/InvoiceForm";
import Container from "./container";
import InvoiceList from "@/components/Invoices/InvoiceList";
const Home = () => {
  return (
    <Container>
      <InvoiceList/>
      {/* <InvoiceForm/> */}
    </Container>
  );
};

export default Home;
