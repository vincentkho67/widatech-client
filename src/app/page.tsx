
import InvoiceForm from "@/components/Invoices/InvoiceForm";
import Container from "./container";
import InvoiceList from "@/components/Invoices/InvoiceList";
import TimeSeriesGraph from "@/components/Invoices/TimeSeriesGraph";
const Home = () => {
  return (
    <Container>
      <TimeSeriesGraph/>
      {/* <InvoiceList/> */}
      {/* <InvoiceForm/> */}
    </Container>
  );
};

export default Home;
