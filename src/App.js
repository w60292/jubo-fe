import "./App.css";
import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import PatientList from "./components/PatientList";
import OrderDialog from "./components/OrderDialog";

import { fetchAPI } from "./utils";

function App() {
  // Avoid loading twice while using react v18+
  const initFlag = useRef(true);
  // Patient List
  const [patients, setPatients] = useState([]);
  // To show the order dialog or not.
  const [showDialog, setShowDialog] = useState(false);
  // Selected Patient.
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSelectedPatient = (data) => {
    setSelectedPatient(data);
    setShowDialog(true);
  };

  useEffect(() => {
    const getPatientList = async () => {
      let patientList = [];

      initFlag.current = false;
      patientList = await fetchAPI("GET", "/getPatients");
      setPatients(patientList);
    };

    if (initFlag.current) {
      getPatientList();
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
          data={selectedPatient}
        />
      </Main>
      <Footer />
    </div>
  );
}

export default App;
