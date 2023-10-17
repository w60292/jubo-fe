import "./App.css";
import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import PatientList from "./components/PatientList";
import OrderDialog from "./components/OrderDialog";

function App() {
  // Avoid loading twice while using react v18+
  const initFlag = useRef(true);
  const [patients, setPatients] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const handleSelectedPatient = (data) => {
    setSelectedData(data);
    setShowDialog(true);
  };

  useEffect(() => {
    const init = async () => {
      initFlag.current = false;
      await fetch("/getPatients")
        .then((res) => res.json())
        .then((jsonResult) => setPatients(jsonResult));
    };

    if (initFlag.current) {
      init();
    }
  }, []);

  return (
    <div className="App">
      <Header title="Tiny Project: Patients and Orders" />
      <Main>
        <PatientList
          data={patients}
          handleSelectedPatient={handleSelectedPatient}
        />
        <OrderDialog
          open={showDialog}
          setShowDialog={setShowDialog}
          data={selectedData}
        />
      </Main>
      <Footer />
    </div>
  );
}

export default App;
