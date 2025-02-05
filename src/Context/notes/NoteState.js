// import react from "react";
import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const s1 = {
    "name": "harry",
    "class": "5b",
  };
  const [state, setstate] = useState(s1);
  let update = () => {
    setTimeout(() => {
      setstate({
        "name": "Larry",
        "class": "10b",
      });
    },5000);
  };
  return (
    <NoteContext.Provider value={{state,update}}>{props.children}</NoteContext.Provider>
  );
};

export default NoteState;
