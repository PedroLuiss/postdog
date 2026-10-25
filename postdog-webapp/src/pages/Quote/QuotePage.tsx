
import styles from "./QuotePage.module.scss";
import { QuoteForm } from '../../components/Quote/Form/QuoteForm';
import { ShipmentProvider } from "../../context/CreateShipmentContext";
import { EmptyStateUi } from "../../components/ui/EmptyStateUi/EmptyStateUi";
import { Calculator } from "lucide-react";

export const QuotePage = () => {
  
  return (
    
    <div className={styles['mainPage']}>
      <ShipmentProvider>
        <QuoteForm />
        <div>
           <EmptyStateUi 
                icon={<Calculator />} 
                description="¡Guau! Las mejores opciones para tus envíos locales y nacionales. Cotiza cualquier paquete sin complicaciones."
            />
        </div>
      </ShipmentProvider>
    </div>
  );
};